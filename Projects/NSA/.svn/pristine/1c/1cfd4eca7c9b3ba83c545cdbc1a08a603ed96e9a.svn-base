/**
 * Created by senthil on 18/09/17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {BaseService} from "../../../../../services/base/base.service";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector: 'transaction-details',
    templateUrl: 'transaction-details.html'
})
export class TransactionDetailsComponent implements OnInit {
    @Input() feeDetailsObj: any
    @Input() feeTansactionDetails: any
    transactions: any = {}
    contact: any;
    constructor(private baseService: BaseService, private serviceUrl: ServiceUrls,private commonService: CommonService
                ) { }
    ngOnInit() {
    }
    getUserContactDetails() {
        this.commonService.get(this.serviceUrl.getUserContactDetails + '?user_id=' + this.feeDetailsObj.userName).then(
            result => this.cbUser(result)
        );
    }

    cbUser(details: any) {
        this.contact = details;
        setTimeout(() =>{
            this.HTMLtoPDF();
        }, 100)
    }


    generateReceipt(event: any) {
        var id = event.target.firstChild.value;
        this.transactions = this.baseService.getObject(this.feeTansactionDetails, {fee_trans_id: id});
        this.getUserContactDetails();
    }

    HTMLtoPDF() {
        this.baseService.HTMLtoPDF(this.serviceUrl.getSchoolLogo, this.feeDetailsObj.firstName + '_' +this.feeDetailsObj.feeAssignmentName);
    }
}