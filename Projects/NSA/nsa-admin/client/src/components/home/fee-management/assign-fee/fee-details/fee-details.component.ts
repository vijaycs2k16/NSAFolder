/**
 * Created by senthil on 1/25/2017.
 */
import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls} from "../../../../../common/index";
import * as myGlobals from "../../../../../common/constants/global";
import {CommonService} from "../../../../../services/common/common.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {ValidationService} from "../../../../../services/validation/validation.service";

declare var $: any
declare var _: any

@Component({
    selector: 'fee-details',
    templateUrl: 'fee-details.html'
})
export class FeeDetailsComponent implements OnInit  {

    @ViewChild('sms') sms: ElementRef
    @ViewChild('chequeDate') cheque1: ElementRef;

    assignedUsers: any
    feeTypesDetails: any
    feeTypes: any
    totalFeeAmount: any
    dueDate: any
    chequeDate: any
    amountPayable: any
    assignees: any;
    refundAmount: any;
    isPartial: boolean
    feeDetailsObj: any = {}
    feeTansactionDetails: any[] = []
    paymentForm: any
    isCash: boolean;
    isBounce: boolean;
    chequeNo: any;
    date: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) { }

    ngOnInit() {
        this.feeTypesDetails= "";
        this.isCash = true;
        this.isBounce = false;
        this.createForm(1)
    }

    createForm(max: any) {
        this.paymentForm = this.fb.group({
            'amount': ['', [Validators.required, ValidationService.numberValueValidator({min: 1, max: max}, 'partialAmount')]],
             notify: this.fb.group({
                "sms":false
            })
        });
    }

    openOverlay(event:any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#feeDetails');
    }


    feeDetails(event: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignment + event.target.value).then(
            result => this.callBack(result)
        );

        this.baseService.dataTableDestroy('datatable-fee-details');
        this.baseService.enableDataTableAjax(this.serviceUrls.getFeeAssignedUser + event.target.value, null);
        this.openOverlay(event)
    }

    callBack(result: any) {
        this.feeTypesDetails = result;
        this.feeTypes = result.feeTypes;
        this.assignees = (this.transform(result.classes, 'name')).toString();
        this.totalFeeAmount = result.totalFeeAmount;
        this.dueDate = result.dueDate;
        this.refundAmount = this.calculateRefundAmount(result.feeTypes);
    }

    transform(value:any[], args:any):any {
        let keys = [];
        for (let key in value) {
            keys.push(value[key][args]);
        }
        return keys;
    }

    calculateRefundAmount(data: any) :any {
        let ramount = 0;
        for (let key in data) {
            var percent = data[key].percent;
            var amount = data[key].amount;
            if(data[key].percent != "") {
                ramount = ramount +  amount * (Number(percent)/100);
            }
        }
        return ramount;
    }

    requested_warning(event:any) {
        this.isPartial = false
        this.feeDetailsObj = JSON.parse(event.target.value)
        this.amountPayable = this.feeDetailsObj.netAmount - (this.feeDetailsObj.paidAmount || 0)
        this.createForm(this.amountPayable)
        this.isCash = true;
        this.baseService.openModal('cash-payment')
    }

    getTransactionDetails(event: any) {
        this.feeDetailsObj = JSON.parse(event.target.value)
        this.commonService.get(this.serviceUrls.getTransactionDetails + this.feeDetailsObj.feeAssignmentDetailId).then(
            trans => this.callBackTrans(trans)
        )
    }

    callBackTrans(trans: any) {
        this.feeTansactionDetails = trans;
        this.baseService.openModal('cash-receipt')
    }

    partial() {
        this.isPartial = true
    }

    full() {
        this.isPartial = false
    }

    cash(){
        this.isCash = true;
    }

    bounce(){
        this.isBounce = true;
    }

    cheque(){
        this.isCash = false;
        this.chequeDate = '';
        this.baseService.openModal('cheque-payment')
    }

    payByCash(event: any) {
        this.baseService.enableBtnLoading('confirmSubmit');
        if(!this.baseService.isEmptyObject($('#payByCashObj').val())) {
            var value = JSON.parse($('#payByCashObj').val());
            value['isPartial'] = this.isPartial;
            var amt = this.isPartial ? this.paymentForm._value.amount : this.amountPayable;
            value['paidAmount'] = String(Number(amt) + Number((this.feeDetailsObj.paidAmount || 0)))
            value['collectedAmount'] = String(amt)
            value['notify'] = this.sms.nativeElement.checked ? true : false;
            value['mode'] = this.isCash == true ? 'Cash' : 'Cheque';
            value['isBounce'] = this.isCash == true ? '' : this.isBounce;
            value['chequeNo'] = this.isCash == true ? '' : this.chequeNo;
            value['chequeDate'] = this.cheque1.nativeElement.value;
            this.commonService.post(this.serviceUrls.payByCash, value).then(
                result => this.payByCashCallBack(result, false),
                error => this.payByCashCallBack(<any>error, true))
        } else {
            this.baseService.disableBtnLoading('confirmSubmit')
        }
    }

    getChequeDate(event: any) {
        this.chequeDate = event.target.value;
        this.paymentForm._value.chequeDate = this.cheque1.nativeElement.value;
    }

    payByCashCallBack(result: any, err: boolean) {
        if(err) {
            this.baseService.showNotification(result.message, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-fee-details');
            this.baseService.closeModal('cash-payment')
        }
        this.baseService.disableBtnLoading('confirmSubmit')
    }

    chequeDetails(event: any){     
        this.chequeDate = this.cheque1.nativeElement.value;
       this.chequeNo = $('#chequeNo').val();
        if(_.isEmpty(this.chequeNo)){
            this.baseService.showNotification("Please Enter the ChequeNo.", "", 'bg-danger');
        }else if(_.isUndefined(this.chequeDate) || _.isEmpty(this.chequeDate)){
            this.baseService.showNotification("Please Select the Cheque Date.", "", 'bg-danger');
        } else {
            $('#chequeNo').val('');
            $('#chequeDate').val('');
            this.chequeDate = '';
            this.baseService.closeModal('cheque-payment')
        }
    }

    modalClose(){
            this.isCash = true;
            this.isBounce = false;
            this.chequeDate = '';
            this.chequeNo =$('#chequeNo').val('');
    }

    checkRole(event: any) {
        if(!this.baseService.checkRole(myGlobals.ASA_USER)) {
            this.baseService.hideColumn('.datatable-fee-details', [6])
        }
    }

}