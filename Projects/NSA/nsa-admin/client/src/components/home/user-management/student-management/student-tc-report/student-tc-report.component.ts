/**
 * Created by Sai Deepak on 15-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var jQuery: any;
declare var _: any;

@Component({
    selector: 'student-tc-report',
    templateUrl: 'student-tc-report.html'
})

export class StudentTcReportComponent implements OnInit {

    @ViewChild('singleClasss') singleClasss: ElementRef;
    @ViewChild('date') date: ElementRef;
    @ViewChild('singleSections') singleSections: ElementRef;
    @ViewChild('sms') sms: ElementRef;
    @ViewChild('email') email: ElementRef;
    @ViewChild('push') push: ElementRef;
    @ViewChild('presntees') presntees: ElementRef;
    @ViewChild('absentees') absentees: ElementRef;
    classes: any;
    sections: any;
    classId: any;
    currentDate: any;
    sectionId: any;
    dates: any;
    className: any;
    sectionName: any;
    constId: '00000000-0000-0000-0000-000000000000';
    feature:any[];
    data: any = {};

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.getActiveClasses();
    }

    openOverlay(event:any) {
        this.baseService.enableLoadingWithMsg('')
        this.baseService.addDisabled('#generatetcReport');
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.currentDate = new Date();
        this.baseService.enableSelectWithEmpty('#attendance-classs', this.classes, this.constants.classObj, null);
        this.baseService.addHideClass('#sections');
        this.baseService.dataTableDestroy('datatable-student-tc-report');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.student + "class/" + this.constId +'/section/' + this.constId);
        this.baseService.openOverlay(event);
        this.baseService.disableLoading()
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#reporttcStudent');

    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
    }

    getSectionByClass() {
        this.classId = this.baseService.extractOptions(this.singleClasss.nativeElement.selectedOptions)[0].id;
        if(this.classId.length < 1) {
            this.baseService.addHideClass('#sectionss');
        }  else {
            this.classId = this.baseService.extractOptions(this.singleClasss.nativeElement.selectedOptions)[0].id;
            this.baseService.removeHideClass('#sectionss');

            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then(
                sections => this.callBackSections(sections)
            )
        }
    }

    callBackSections(data: any) {
        this.sections = data;
        this.baseService.enableSelect('#attendance-sections', data, this.constants.sectionObj, null)
    }


    getStudentData() {
        this.classId = this.baseService.extractOptions(this.singleClasss.nativeElement.selectedOptions)[0].id;
        this.className = this.baseService.extractOptions(this.singleClasss.nativeElement.selectedOptions)[0].name;
        var dataFound = this.setValidations();
        if(dataFound){
            this.sectionId = this.baseService.extractOptions(this.singleSections.nativeElement.selectedOptions)[0].id;
            this.sectionName = this.baseService.extractOptions(this.singleSections.nativeElement.selectedOptions)[0].name;
            this.baseService.dataTableDestroy('datatable-student-tc-report');
            var url = this.serviceUrls.student + "class/" + this.classId + '/section/' +this.sectionId;
            this.baseService.enableDataSourceDatatable(url);
            this.baseService.removeDisabled('#generatetcReport');
        }
    }

    save(id: any, event: any) {
        this.saveJson(id, event.target.value);
    }


    generateCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
           //this.baseService.enableDivLoading('.generatetcReport', this.constants.getReady)
            this.baseService.rportData(result)
            this.baseService.disableBtnLoading(id);
        }
    }


    saveJson(id: any, values: any) {
       var value = JSON.parse(values);
       if(!this.classId){
           this.baseService.showNotification('Please Select Class', "", 'bg-danger');
           return false;
       } else if(!this.sectionId) {
           this.baseService.showNotification('Please Select Section', "", 'bg-danger');
           return false;
       } else if(value.matches.length < 1) {
           this.baseService.showNotification('Please Select Students', "", 'bg-danger');
           return false;
       } else {
           this.baseService.enableBtnLoading(id);
           value.tcObj = value.tcObj.filter((val: any) => {
               return (!_.isUndefined(val.progress) && !_.isEmpty(val.progress));
           });
           value.matches = _.map(value.tcObj, 'id');
           this.data.users =  value.matches;
           this.data.tcObj =  value.tcObj;
           this.commonService.post(this.serviceUrls.student + 'tcreport/', this.data).then(
               result => this.generateCallBack(result, id, false),
               error => this.generateCallBack(<any>error, id, true))
       }
    }

    resetForm() {
        this.baseService.addDisabled('#saveAttendance');
        this.baseService.enableSelectWithEmpty('#attendance-classs', this.classes, this.constants.classObj, null);
        this.baseService.addHideClass('#sectionss');
        this.baseService.dataTableDestroy('datatable-student-tc-report');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.student + "class/" + this.constId +'/section/' + this.constId);
    }

    setValidations() : any {
        var dataFound = false;
        this.classId = this.baseService.extractOptions(this.singleClasss.nativeElement.selectedOptions)[0].id;
        if(this.classId.length < 1) {
            this.baseService.showNotification("Enter Class Details", "", 'bg-danger');
        }  else {
            dataFound = true;
        }

        return dataFound;
    }
}