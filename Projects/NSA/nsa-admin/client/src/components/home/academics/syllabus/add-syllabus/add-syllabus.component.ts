/**
 * Created by Deepa on 6/21/2017.
 */
import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {TreeService} from "../../../../../services/tree/tree.service";
import {FileUploader} from "ng2-file-upload";
import {SyllabusComponent} from "../syllabus.component";

@Component({
    selector: 'add-syllabus',
    templateUrl: 'add-syllabus.html'
})
export class AddSyllabusComponent implements OnInit {
    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private treeService: TreeService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    @ViewChild('classSelect') classSelect: ElementRef;
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', maxFileSize:10*1024*1024, allowedMimeType: ['application/pdf']});

    SyllabusForm: any
    data: any[] = []
    hash: any[]
    modalId: any;
    schoolSyllabus : any;
    selectedNodes: any[] = []
    classes: any[] = []
    userType: any[] = []
    classNames: any;
    classIds: any[] = [];
    attachments: any[] = [];
    attachmentsForm: any = {};
    uploadId: any
    selectedClass: any = []
    edit: boolean
    editObj: any = {}
    parent: SyllabusComponent;
    editClass: any = true;
    result : any;
    videoTypes: any[] = ['video/mp4', 'video/avi', 'video/flv', 'video/mp4', 'video/wmv', 'video/3gpp']

    ngOnInit() {
        this.createForm()
        this.schoolSyllabus = '';
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            if (this.baseService.isContainsKey(this.videoTypes, item.file.type)) {
                var url = item.url + '/video'
                item.url = url
            }
        }

        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadNotification(item, filter, options)
            return {item, filter, options};
        }

        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.uploadId);
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments = this.attachments != null ? this.attachments : [];
            if (this.baseService.isContainsKey(this.videoTypes, item.file.type)) {
                this.attachments.push(this.baseService.extractVideoAttachment(response))
            } else {
                console.log('success.....')
                this.attachments.push(this.baseService.extractAttachment(response))
            }
        }
    }

    openOverlay(event: any) {
        this.baseService.openOverlay(event)
    }

    addSyllabus(event: any) {
       this.editClass = true;
       this.baseService.removeHideClass('.editClass')
       this.commonService.get(this.serviceUrls.classes ).then(
            result => this.categoryCallback(result, false),
            error => this.categoryCallback(<any>error, true))
        this.openOverlay(event);
    }

    categoryCallback(result: any, err: any) {
        this.baseService.enableMultiSelectFilteringAll('.select-class', result, this.constants.classNameObj   , this.selectedClass);
    }

    closeOverlay(event:any) {
        this.attachments = [];
        this.createForm();
        this.baseService.closeOverlay('#addSyllabus');
    }

    createForm() {
        this.selectedClass = [];
        this.uploader.clearQueue();
        this.SyllabusForm =  this.fb.group({
            'name': ['', Validators.required],
            'description': [''],
            'classes': [''],
            notify: this.fb.group({
                "sms":false,
                "email": false,
                "push": false

            }),
            "notifyTo":{
                "userType":[
                ],
                "status":"Sent",
                "count":1
            },
        })
        setTimeout(() => {
            this.edit = false;
        }, 500)
    }

    save(event: any) {
        if(this.setValidations()) {
           // this.baseService.enableLoadingWithMsg('Uploading! Please Wait...')
           //this.baseService.enableBtnLoading('saveSyllabus');
            this.SyllabusForm._value.classes = this.classNames;
            this.SyllabusForm._value.classIds = this.classIds;
            this.SyllabusForm._value.numberOfFiles = this.uploader.queue.length;
            this.SyllabusForm._value.notify.sms = this.sms.nativeElement.checked;
            this.SyllabusForm._value.notify.email = this.email.nativeElement.checked;
            this.SyllabusForm._value.notify.push = this.push.nativeElement.checked;
            this.commonService.post(this.serviceUrls.syllabus, this.SyllabusForm._value).then(
                result => this.saveCallBack(result, false),
                error => this.saveCallBack(<any>error, true))
        }
    }

    saveCallBack(result: any, err: boolean) {
        console.log('saveCallBack.......')
        var isById = result.isId ? true : false;
        console.log('isById.....',isById)
        this.uploadId = result.id;
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm['id'] = result.id;
            this.attachmentsForm['classes'] = this.classNames;
            this.attachmentsForm['attachments'] = this.attachments;
            console.log('this.attachments.....',this.attachments)
            this.saveSyllabusDetails(isById);
        }
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.uploader.uploadAll();
        }
    }

    saveSyllabusDetails(bool: boolean) {
        let url = bool ? this.serviceUrls.syllabus + this.schoolSyllabus.classId : this.serviceUrls.syllabus;
        this.commonService.put(url, this.attachmentsForm).then(
            result => this.saveSyllabusDetailsCallBack(result, false),
            error => this.saveSyllabusDetailsCallBack(<any>error, true))
    }

    saveSyllabusDetailsCallBack(result: any, err: boolean) {
        this.attachments.pop();
        if(err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            console.log('saveSyllabusDetailsCallBack.....')
            this.uploader.clearQueue();
            this.closeOverlay(null);
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
       // this.baseService.disableBtnLoading('saveSyllabus');
        this.baseService.disableLoading();
        this.baseService.dataTableReload('datatable-syllabus')

    }

    update(event: any) {
        this.SyllabusForm._value.notify.sms = this.sms.nativeElement.checked;
        this.SyllabusForm._value.notify.email = this.email.nativeElement.checked;
        this.SyllabusForm._value.notify.push = this.push.nativeElement.checked;
        this.SyllabusForm._value.classes = [{"id": this.schoolSyllabus.classId, name: this.schoolSyllabus.className }]
        this.commonService.put(this.serviceUrls.syllabus + this.schoolSyllabus.classId, this.SyllabusForm._value).then(
            result => this.updateCallback(result, false),
            error => this.updateCallback(<any>error, true));
    }

    updateCallback(result: any, err: boolean) {
          if(this.uploader.queue.length > 0) {
              console.log('this.uploader.queue.length.....',this.uploader.queue.length)
           result = {}
            result['isId'] = true;
            this.saveCallBack(result, err);
          } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.closeOverlay(event);
            this.baseService.dataTableReload('datatable-syllabus');
          }  
    }

    getEditSyllabus(event:any, pParent: any) {
        this.parent = pParent;
        this.modalId = event;
        this.commonService.get(this.serviceUrls.getSchoolSyllabusById + event.target.value).then(
            result => this.callBack(result)
        );
    }

    callBack(value:any) {
        this.schoolSyllabus = value[0];
        this.editForm(value);
    }

    editForm(form:any) {
        this.editClass = false;
        this.baseService.addHideClass('.editClass')
        this.attachments = form[0].attachments;
        this.SyllabusForm = this.fb.group({
            'name': [form[0].name],
            'description': [form[0].description],
            'classes': [ '' ],
            notify: this.fb.group({
                sms: [true, Validators.required]
            }),
            "notifyTo":{
                "userType":[
                ],
                "status":"Sent",
                "count":1
            },
        });
        this.baseService.openOverlay(this.modalId);
    }

    viewAttachment() {
        this.commonService.get(this.serviceUrls.syllabus + this.schoolSyllabus.classId).then(
            syllabus => this.callBackAttachment(syllabus)
        );
    }

    callBackAttachment(value: any){
        this.schoolSyllabus = value[0];
        this.schoolSyllabus.id = this.schoolSyllabus.classId;
        this.schoolSyllabus['url'] = this.serviceUrls.getSchoolAttachmentId;
        this.parent.attachmentComponent.openModal(this.schoolSyllabus, true);
    }

    setValidations() : any {
        var dataFound = false;
        this.classNames = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions);
        this.classIds = this.baseService.extractOptionValue(this.classSelect.nativeElement.selectedOptions);
        if(this.classNames.length < 1) {
            this.baseService.showNotification(this.constants.selectClass, "", this.constants.j_danger);
        } else {
            dataFound = true;
        }
        return dataFound;
    }

    getExistingFiles(event: any){
        this.attachments = event.target.value;
    }

    setFormValues(obj: any) {
       // this.selectedCalss = this.baseService.getObjectValues(JSON.parse(obj.class_objs), 'id');
        this.SyllabusForm =  this.fb.group({
            'syllabusName': [obj.name, Validators.required],
            'description': [obj.description || ''],
            'class': [''],
        })
    }
}