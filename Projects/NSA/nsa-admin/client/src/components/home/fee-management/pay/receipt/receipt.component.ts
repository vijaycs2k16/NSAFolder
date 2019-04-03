/**
 * Created by senthil on 18/09/17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
import {Constants, Messages} from "../../../../../common/index";
declare var $ : any;
declare var _ : any;

@Component({
    selector: 'receipt',
    templateUrl: 'receipt.html',
})

export class ReceiptComponent implements OnInit {
    @Input() feeDetails: any
    @Input() contact: any
    private transactions: any = {}
    amount: any;
    user: any;
    schoolDetails: any;
    address: any;
    enable : boolean;
    //contact: any;

    generatedDate: any = new Date()

    @Input()
    set transaction(transaction: any) {
        this.transactions = transaction;
    }

    constructor(private baseService: BaseService, private commonService: CommonService,
                private serviceUrls: ServiceUrls, private constants: Constants) {}

    ngOnInit() {
        this.getSchoolDetails();
        this.enable = this.baseService.isSchool(this.constants.ASSHAM_SCHOOL_ID);
    }

    getSchoolDetails(){
        this.commonService.get(this.serviceUrls.getSchoolDetails).then(schoolDetails => this.callback(schoolDetails));
    }

    getUserContactDetails() {
        this.commonService.get(this.serviceUrls.getUserContactDetails + '?user_id=' + this.feeDetails.user_name).then(
            result => this.cbUser(result)
        );
    }

    cbUser(details: any) {
        this.contact = details;
    }

    callback(details: any){
        this.user = details;
        var contactNumbers = ''
        if(this.enable == false) {
            var street1 = details.street_address_1 ? details.street_address_1 +',' +'<br/>': '';
            var street2 = details.street_address_2 ? details.street_address_2 +',' + '<br/>':'';
            contactNumbers = details.phone_number ? _.values(details.phone_number) : [];
            var contactInformation = !_.isEmpty(contactNumbers) ?  'Mobile :' + contactNumbers : '';
            var email = details.email ? 'Email :' + details.email :'';
            this.address = street1 + street2 + contactInformation + email + '.';
        } else {
            var street1 = details.street_address_1 ? details.street_address_1 +'<br/>' : '';
            var email = details.email ? 'Email : ' + details.email :'';
            contactNumbers = details.phone_number.primary ?'Phone :'+ details.phone_number.primary + ', ' + email : '';
            this.address = street1 + contactNumbers + '.';
        }
        if(details.logo) {
            var url = this.baseService.getBaseUrlWithoutSchool();
            this.schoolDetails = url + details.logo;
        }
    }
}
