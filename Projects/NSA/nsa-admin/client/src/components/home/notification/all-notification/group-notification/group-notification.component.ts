import {Component, DoCheck, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {AttachmentComponent} from "../../../common/attachment/attachment.component";
import {CommonService} from "../../../../../services/common/common.service";
import {FileUploader} from "ng2-file-upload";
declare var _ : any;

@Component({
    selector: 'group-notification',
    templateUrl: 'group-notification.html'
})
export class GroupNotificationComponent implements OnInit {

    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef
    @ViewChild('date') date: ElementRef;
    //@ViewChild('multiClass') multiClass: ElementRef;
    @ViewChild('classSelect') classSelect: ElementRef;
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;


    data:any[] = [];
    hash : any [] = [];
    notified: any[] = [];
    classObject: any[] = [];
    objId: any;
    attachments: any[] = [];
    existingAttachments: any[] = [];
    classes: any[] = [];
    userType: any[] = [];
    selectedNodes:any[] = [];
    enableData: boolean = false;
    oldStatus:string;
    status:any;
    templates:any[];
    template:any[];
    notification:any[];
    notifyObj: any;
    templateForm:any;
    charMinLength = this.constants.charMinLength;
    media:any;
    roleId:any;
    deleteObj: boolean = true;
    templateId:any;
    currentText:any;
    notificationId:any = '';
    selectedClass: any = [];
    count:any = 1;
    charsLeft:any = 900;
    taxanomy: any[]= [];
    enable: boolean = false;
    btnEnable: boolean = false;
    selectedTypes = [{templateId: '00000000-0000-0000-0000-000000000000', templateName: 'Select Template'}];
    feature:any[];
    users: any[];
    startDate: any;
    endDate: any;
    dates: any;
    isDuration: boolean = false;
    results: string[];
    attachmentsForm: any = {};
    disSend: boolean;

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', maxFileSize:10*1024*1024, allowedMimeType: this.constants.allowFileTypes});


    constructor(private baseService: BaseService,
                private constants: Constants,
                private commonService: CommonService,
                private formBuilder: FormBuilder,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Notifications');
        this.enable = this.baseService.havePermissionsToEdit(this.constants.NOTIFICATION_PERMISSIONS);
        this.btnEnable = this.baseService.haveBtnPermissions(this.constants.NOTIFICATION_PERMISSIONS, this.constants.SEND);
        this.getMediaCount();
        this.template = [{template_message: ''}];
        this.createForm();
        this.notifyObj = "";
        this.getUserGroups();
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();

        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }
        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadFileNotification(item, filter, options)
            return {item, filter, options};
        }
        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.objId);
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments.push(this.baseService.extractAttachment(response))
        }

    }

    createForm() {
        //this.templateId = this.selectedTypes[0].templateId;
        this.templateForm = this.formBuilder.group({
            'phoneNo': [],
            'students': [],
            //'notifiedCategories': [],
            'createdDate': [],
            'notificationId': this.notificationId,
            notifyTo: this.formBuilder.group({
                'userType': [],
                'status': ['Sent'],
                'count': ['1']
            }),
            notifyFrom: this.formBuilder.group({
                /*'userId' : ["111"]*/
            }),
            notify: this.formBuilder.group({
                "sms":false,
                "email": false,
                "push": false

            }),
            smsTemplate: this.formBuilder.group({
                'templateId': '',
                'templateName': ['', Validators.required],
                'templateTitle': [''],
                'title': ['', Validators.required]
            }),
            pushTemplate: this.formBuilder.group({
                'templateId': '',
                'templateName': [''],
                'templateTitle': [''],
                'title': ['']
            }),
            emailTemplate: this.formBuilder.group({
                'templateId': '',
                'templateName': [''],
                'templateTitle': [''],
                'title': ['']
            }),

            //'classes': [''],
            'attachments': ['']
        });
    }

    getUserGroups() {
        this.commonService.get(this.serviceUrls.getGroupDetails).then(
            result => this.callbackDetails(result)
        );
    }

    callbackDetails(value: any) {
        this.baseService.enableMultiSelectFilteringAll('.select-class', value, [ 'group_name', 'id' ]   , this.selectedClass);
    }


    resetForm() {
        this.baseService.removeHideClass('.Draft');
        this.baseService.removeHideClass('.Sent');
        this.baseService.clearText('.ui-inputtext');
        this.createForm();
        this.notificationId = '';
        this.existingAttachments = [];
        this.attachments = [];
        this.getUserGroups();
        //this.classes = [];
        this.templateForm._value.smsTemplate.templateName = '';
        this.userType = [];
        this.enableData = true;
        this.selectedNodes = [];
        this.templateId = '';
        this.currentText = '';
        this.count = '';
        this.notifyObj = "";
        this.deleteObj = true;
        this.uploader.clearQueue();
        this.users = [];
        this.changed();
    }


    keyDown() {
        setTimeout(() => {
            this.changed()
        }, 50);
    }


    changed() {
        this.count = 1;
        this.currentText = this.templateForm._value.smsTemplate.templateName.length;
        this.charsLeft = 900 - this.currentText;
        this.count = this.currentText / this.charMinLength > 0 ? Math.ceil(this.currentText / this.charMinLength) : 1;
        this.templateForm._value.notifyTo.count = this.count;
    }

    search(event: any) {
        this.commonService.get(this.serviceUrls.searchEmpStud + event.query).then(
            texts => this.results = texts
        )
    }
    getMediaCount() {
        this.commonService.get(this.serviceUrls.getMediaCountUrl)
            .then(media => this.media = media);
    }

    viewAttachment() {
        this.commonService.get(this.serviceUrls.getNotificationById + '/' + this.notifyObj.notification_id).then(
            notification => this.callBackAttachment(notification)
        );
    }

    callBackAttachment(value: any){
        console.log('callBackAttachment.......',value)
        this.notifyObj = value[0];
        if(this.notifyObj.status == 'Sent') {
            this.deleteObj = false;
            this.notifyObj.attachments = this.existingAttachments;
        }
        this.notifyObj['url'] = this.serviceUrls.deleteNotifyAttachement;
        this.notifyObj.id = this.notifyObj.notification_id;
        this.attachmentComponent.openModal(this.notifyObj, this.deleteObj)
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#modal_theme_primary');
        this.resetForm()
    }

    setFormValues() {
        this.templateForm._value.smsTemplate.templateId = this.templateId

        this.templateForm._value.notifyTo.status = this.status;
        //this.templateForm._value.classes = this.classes;
        this.templateForm._value.notifyTo.userType = this.userType;
        this.notificationId = this.templateForm._value.notificationId;
        this.templateForm._value.notify.sms = this.sms.nativeElement.checked;
        this.templateForm._value.notify.email = this.email.nativeElement.checked;
        this.templateForm._value.notify.push = this.push.nativeElement.checked;
        this.templateForm._value.pushTemplate = this.templateForm._value.smsTemplate;
        this.templateForm._value.pushTemplate.templateTitle = this.templateForm._value.smsTemplate.title;
        this.templateForm._value.emailTemplate = this.templateForm._value.smsTemplate;
        this.templateForm._value.emailTemplate.templateTitle = this.templateForm._value.smsTemplate.title;
        this.templateForm._value.taxanomy = this.baseService.removeCylicObj(this.taxanomy);
        this.templateForm._value.selectedNodes = this.selectedNodes;
        //this.templateForm._value.users = this.users;
        this.templateForm._value.attachments = this.existingAttachments;
    }



    saveNotification(id:any) {
        this.setFormValues();
        if (this.templateForm.valid) {
            this.templateForm._value.students = !_.isEmpty(this.templateForm._value.students) ? this.templateForm._value.students : null;
            if (!this.templateForm._value.notify.sms && !this.templateForm._value.notify.push) {
                this.baseService.showNotification('Message Not Sent', "Please Select Notification Channel", 'bg-danger');

            } else if (this.notificationId != '' && this.oldStatus != 'Sent') {
                this.templateForm._value.notifyTo.status = id;
                this.baseService.enableBtnLoading(id);
                this.templateForm._value.notifyTo.sendMedia = true;
                if(this.uploader.queue.length > 0) {
                    this.templateForm._value.notifyTo.sendMedia = false;
                }
                this.templateForm._value.groups = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions);
                this.templateForm._value.type = 'Group'
                if(this.templateForm._value.groups.length > 0) {
                    this.templateForm._value.group_id = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0].id;
                    this.templateForm._value.group_name = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0].name;
                    this.commonService.put(this.serviceUrls.updateNotification + '/' + this.notificationId,this.templateForm._value).then(
                        result => this.saveNotificationCallBack(result, id, false),
                        error => this.saveNotificationCallBack(<any>error, id, true))
                } else {
                    this.baseService.showNotification('Please Select the Select User Group(s).' ,"", "bg-danger")
                }


            } else {
                this.templateForm._value.notifyTo.status = id;
                this.baseService.enableBtnLoading(id);
                var url = id == "Sent" ? this.serviceUrls.saveTemplate : this.serviceUrls.saveDaftTemplate;
                if(this.uploader.queue.length > 0) {
                    url = id == "Sent" ? this.serviceUrls.saveSentTemplate : this.serviceUrls.saveDaftTemplate;
                }
                this.templateForm._value.groups = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)|| 0;
                this.templateForm._value.type = 'Group'
                if(this.templateForm._value.groups.length > 0) {
                    this.templateForm._value.group_id = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0].id;
                    this.templateForm._value.group_name = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0].name;
                    this.commonService.post(url, this.templateForm._value).then(
                        result => this.saveNotificationCallBack(result, id, false),
                        error => this.saveNotificationCallBack(<any>error, id, true))
                } else {
                    this.baseService.showNotification('Please Select the Select User Group(s).' ,"", "bg-danger")
                }
            }
        }
    }

    saveNotificationCallBack(result:any, id:any, error:boolean) {
        this.objId = result.data != undefined ? result.data.notification_id : "";
        if(this.uploader.getNotUploadedItems().length) {
            this.uploader.uploadAll();
        } else {
            this.addAttachementsCallback(result, id, error)
        }
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm = this.templateForm._value
            this.attachmentsForm['attachments'] = this.attachments;
            this.addAttachements(this.attachmentsForm, this.objId, id)
        }
    }

    addAttachements(data: any, objId: any, id: any) {
        this.commonService.put(this.serviceUrls.addNotificationAttachments + objId, data).then(
            result => this.addAttachementsCallback(result, id, false),
            error => this.addAttachementsCallback(<any>error, id, true))
    }

    getNotificationById(event: any, res: any, overlay: any){
        var value = JSON.parse(event.target.value);
        var cyear = (localStorage.getItem(this.constants.cyear) == 'true');
        this.enableData = value.editPermissions && cyear;
        if(this.enableData) {
            this.baseService.removeHideClass('.Draft');
            this.baseService.removeHideClass('.Sent');
        } else {
            this.baseService.addHideClass('.Draft');
            this.baseService.addHideClass('.Sent');
        }
        this.commonService.get(this.serviceUrls.getNotificationById + '/' + value.notification_id)
            .then(notification => this.callBackNotification(event, notification, overlay))
    }


    callBackNotification(event: any, res:any, overlay:any) {
            var sms = _.find(res[0].media_name, function (o:any) {
                return o == "sms";
            }) != undefined ? true : false;
            var push = _.find(res[0].media_name, function (o:any) {
                return o == "push";
            }) != undefined ? true : false;
            var cYear = (localStorage.getItem(this.constants.cyear) == 'true');
            if (cYear) {
                if (sms && !push) {
                    this.sms.nativeElement.checked = true;
                    this.push.nativeElement.checked = false;
                } else if (!sms && push) {
                    this.sms.nativeElement.checked = false;
                    this.push.nativeElement.checked = true;
                } else {
                    this.sms.nativeElement.checked = true;
                    this.push.nativeElement.checked = true;
                }
            }
            this.notification = res;
            this.notifyObj = res[0];
            var notifiedStudents = _.filter(JSON.parse(res[0].notified_students), function (o:any) {
                if (o.suggestStudent) {
                    return o;
                }
            });
            this.existingAttachments = res[0].attachments;
            this.templateForm = this.formBuilder.group({
                'students': notifiedStudents ? [notifiedStudents] : [],
                'phoneNo': res[0].notified_mobile_numbers != null ? res[0].notified_mobile_numbers.toString() : [],
                'createdDate': res[0].created_date,
                'notificationId': [res[0].notification_id],
                notifyTo: this.formBuilder.group({
                    'userType': '',
                    'status': ['Sent'],
                    'count': ['1']
                }),
                notifyFrom: this.formBuilder.group({
                    /*'userId' : ["111"]*/
                }),
                notify: this.formBuilder.group({
                    sms: [true, Validators.required]
                }),
                smsTemplate: this.formBuilder.group({
                    'templateId': res[0].template_id,
                    'templateName': [res[0].message],
                    'templateTitle': [res[0].template_title],
                    'title': [res[0].title]
                }),
                //'classes': [''],
                attachments: [res[0].attachments]
            });
            this.editUserGroups(res[0].group)
            this.keyDown()
            this.oldStatus = res[0].status;
        if (overlay == 'true') {
            this.baseService.openOverlay(event);
        } else {
            this.sendSms(res[0].notification_id, this.templateForm._value);
        }
    }


    editUserGroups(id: any[]) {
        this.commonService.get(this.serviceUrls.getGroupDetails).then(
            result => this.editCallbackDetails(result, id)
        );
    }

    editCallbackDetails(value: any, id: any[]) {
        var arr = [];
        for(var i=0; i< id.length; i++){
            arr.push(id[i].id)
        }
        this.baseService.enableMultiSelectFilteringAll('.select-class', value, [ 'group_name', 'id' ] , arr);
    }

    sendSms(id: any ,notifyObj: any) {
        this.commonService.put(this.serviceUrls.getNotificationById + '/send/' + id, notifyObj).then(
            result => this.addAttachementsCallback(result, '', false),
            error => this.addAttachementsCallback(<any>error, '', true))
    }

    addAttachementsCallback(result: any, id:any , err: any) {
        this.attachments.pop();
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#modal_theme_primary');
            this.reload();
            this.baseService.dataTableReload('datatable-my-notifications');
            this.getMediaCount();
            this.resetForm();
            this.uploader.clearQueue();
        }
        this.baseService.disableBtnLoading(id);
    }

    reload() {
        this.baseService.enableDivLoading('.datatable-nested', this.constants.updating);
        var thisObj = this;
        setTimeout(function () {
            thisObj.baseService.dataTableReload('datatable-nested');
            thisObj.baseService.disableDivLoading('.datatable-nested');
        }, 1000)
    }

}