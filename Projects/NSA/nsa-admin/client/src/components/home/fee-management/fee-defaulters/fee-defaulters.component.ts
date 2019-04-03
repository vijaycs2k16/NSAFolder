/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, ServiceUrls} from "../../../../common/index";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'fee-defaulters.html'
})
export class FeeDefaultersComponent implements OnInit {

    @ViewChild('singleClass') singleClass:ElementRef
    @ViewChild('singleFee') singleFee:ElementRef
    @ViewChild('singleSection') singleSection:ElementRef
    @ViewChild('date') date:ElementRef

    sections: any;
    classId: any;
    classes: any;
    startDate: any;
    endDate: any;
    sectionId: any;
    dates: any;
    className: any;
    sectionName: any;
    feeNames: any;
    feestruid : any;
    constId:'00000000-0000-0000-0000-000000000000';

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - datatable-fee-defaulters');
        this.baseService.enableAppJs();
        this.getALlClasses();
        //this.getFeeNames();
        this.resetDatatable();
        this.baseService.addHideClass('#fee');
    }

    getALlClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
        this.baseService.enableSelectWithEmpty('#bootstrap-class', data, this.constants.classObj, null);
    }

    getSectionByClass() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        if (this.classId == undefined || this.classId == "") {
            this.baseService.addHideClass('#sections');
        } else {
            this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
            this.baseService.removeHideClass('#sections');
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then(
                sections => this.callBackSections(sections)
            )
        }
    }

    callBackSections(data: any) {
        this.sections = data;
        this.baseService.enableSelectWithEmpty('#bootstrap-section', data, this.constants.sectionObj, null)
        this.getFeeNames();
    }

    getFeeNamesDetails(){
        this.feestruid =this.baseService.extractOptions(this.singleFee.nativeElement.selectedOptions)[0].id;
        if(this.feestruid == ''){
            this.resetDatatable();
        }
    }


    getFeeNames() {
        this.baseService.removeHideClass('#fee');
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].id;
        this.commonService.get(this.serviceUrls.getFeeName + '?classId=' + this.classId + '&sectionId=' + this.sectionId ).then(
            Names => this.callBackFeeNames(Names)
        )
    }

    callBackFeeNames(data: any) {
        this.feestruid = '';
        this.resetDatatable();
        if(data) {
            this.baseService.enableSelectWithEmpty('#bootstrap-fee', data, this.constants.feeNameObj, null);
        } else {
            this.baseService.showNotification("Please create the fee Name.", "", 'bg-danger');
        }
    }

    getFeeDetailsData() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.className = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].name;
        if (this.classId == undefined || this.classId == "") {
            this.baseService.showNotification("Select Class", "", 'bg-danger');
        } else {
            this.sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].id;
            this.sectionName = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].name;
            if(this.feestruid == undefined || this.feestruid == ""){
                this.baseService.showNotification("Select Fee Name.", "", 'bg-danger');
            } else {
                this.baseService.destroyDatatable('.datatable-fee-defaulters');
                var url = this.serviceUrls.getFeeDefaulters + '/' + this.feestruid + '?classId=' + this.classId + '&sectionId=' + this.sectionId;
                this.baseService.enableDataTable(url);
            }
        }
    }

    callBackFeeStructure(result: any){
        this.baseService.enableDataTable(result);
    }

    resetForm() {
        this.baseService.addHideClass('#sections');
        this.baseService.addHideClass('#fee');
        this.getALlClasses();
        //this.getFeeNames();
        this.resetDatatable();
    }

    resetDatatable() {
        this.baseService.dataTableDestroy('datatable-fee-defaulters');
        var constId = '00000000-0000-0000-0000-000000000000';
        var url = this.serviceUrls.getFeeDefaulters + '/'+ constId ;
        this.baseService.enableDataTable(url);
    }

}
