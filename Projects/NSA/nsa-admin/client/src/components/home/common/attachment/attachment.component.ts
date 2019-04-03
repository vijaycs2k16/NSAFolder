/**
 * Created by senthil-p on 16/05/17.
 */
import { Component, OnInit, ViewChild }    from '@angular/core';
import { BaseService } from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {CommonService} from "../../../../services/common/common.service";
declare var $: any;
declare var _: any;

@Component({
    selector: 'attachment',
    templateUrl: 'attachment.html'
})
export class AttachmentComponent implements OnInit{
    attachments: any;
    config: any;
    url: any;
    object: any;
    deleteObj: boolean;
    status : boolean;
    cYear: any;
    deleteCond: any;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants,
                private messages: Messages) {
        this.config = baseService.config;
    }

    ngOnInit() {
        this.cYear = this.baseService.isCurrentYear();
    }

    openModal(value: any, deleteObj: boolean) {
        this.deleteObj = deleteObj;
        this.deleteCond = this.deleteCheck(deleteObj);
        this.object = value;
        this.status = value.scheduleobject != undefined ? value.scheduleobject : false;
        this.attachments = value.attachments;
        this.url = this.baseService.getBaseUrl();
        this.baseService.openModal('modal_primary')
    }

    openModalByCls(id: any, value: any, deleteObj: boolean) {
        this.deleteObj = deleteObj;
        this.deleteCond = this.deleteCheck(deleteObj);
        this.object = value;
        this.status = value.scheduleobject != undefined ? value.scheduleobject : false;
        this.attachments = value.attachments;
        this.url = this.baseService.getBaseUrl();
        this.baseService.openModalByClass(id, 'modal_primary')
    }

    deleteCheck(delObj: any){
        if(this.cYear && this.deleteObj)
            return true;
        else
            return false;
    }

    requested_warning() {
        if(this.status && this.deleteObj) {
            this.baseService.showNotification('You cannot delete this file', '', 'bg-danger');
        } else {
            this.baseService.showWarning();
        }

    }

    deleteFile(event: any){
        if(event.target.value){
            var currentFile = event.target.value;
            this.object['curentFile'] = currentFile;
            console.log('this.deleteObj...',this.deleteObj)
            if(this.deleteObj == true) {
                this.commonService.deleteMethod(this.object.url + this.object.id ,this.object)
                    .then(data => this.callBackSuccess(data, false))
                    .catch(err => this.callBackSuccess(err, true));
            } else {
                var d = _.remove(this.attachments, function(n: any) {
                    return n.id == currentFile;
                });
                this.baseService.showNotification('File deleted Successfully', '', 'bg-success');
                if(_.isEmpty(this.attachments)) {
                    this.baseService.addHideClass('#viewAttachment');
                }
                $('#existingFiles').val(JSON.stringify(this.attachments));
                $('#existingFiles').click();
            }
        }
    }

    callBackSuccess(result: any, err: boolean){
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, '', 'bg-success');
            console.log('result.data.attachments....',result.data.attachments)
            if(_.isEmpty(result.data.attachments)){
                this.baseService.addHideClass('#viewAttachment');
                this.attachments = [];
            }else {
                this.attachments = result.data.attachments;
                this.object = result.data;
            }
            $('#existingFiles').val(JSON.stringify(this.attachments));
            $('#existingFiles').click();
        }
    }

}