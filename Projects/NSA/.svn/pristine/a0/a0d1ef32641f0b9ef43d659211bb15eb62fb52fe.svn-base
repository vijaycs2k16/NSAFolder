/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {AddStudentComponent} from "./add-students/add-student.component";
import {CommonService} from "../../../../services/common/common.service";
import {StudentReportComponent} from "./student-report/student-report.component";
import {StudentTcReportComponent} from "./student-tc-report/student-tc-report.component";
//noinspection TypeScriptCheckImport
@Component({
    templateUrl: 'students.html'
})
export class StudentsComponent implements OnInit {
    @ViewChild(AddStudentComponent) addStudentComponent: AddStudentComponent;
    @ViewChild(StudentReportComponent) studentReportComponent: StudentReportComponent;
    @ViewChild(StudentTcReportComponent) studentTcReportComponent: StudentTcReportComponent

    classSections: any[];
    student_to_delete: string;
    enable: boolean = false;
    active: boolean = true;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants,
                private messages: Messages) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Students')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.getFilter();
        this.baseService.enableDataTable(this.serviceUrls.student + 'all');
        this.enable = this.baseService.isTcSchool(this.constants.SCHOOL_TC_REPORT);
        this.commonService.get(this.serviceUrls.classSession).then(classSections => this.callBack(classSections));
    }

    callBack(classSections: any) {
        this.classSections = classSections;
    }

    getFilter() {
        var filter = [{value: 'active', name: 'Active'},
            {value: 'deactive' , name: 'Deactive'}]
        this.baseService.enableSelect('#bootstrap-Filter', filter, [ 'name', 'value' ], 'active');
    }

    getStudentByFilter(event: any, act: any){
        if(act) {
            this.active = event.target.value == 'active' ? true : false;
            this.baseService.dataTableDestroy('datatable-student');
            this.baseService.enableDataTable(this.serviceUrls.student + 'all?count=2&active=' + this.active);
        }
    }

    addStudent(event: any) {
        this.addStudentComponent.openOverlay(event, 'Save', null, this);
    }

    reportStudent(event: any) {
        this.studentReportComponent.openOverlay(event);
    }
    reporttcStudent(event: any) {
        this.studentTcReportComponent.openOverlay(event);
    }


    editStudent(event: any) {
        this.addStudentComponent.editStudent(event, this);
    }

    printStudent(event: any) {
        this.baseService.enableDivLoading('.datatable-student', this.constants.getReady);
        this.commonService.get(this.serviceUrls.student + 'report/' + event.target.value).then(report => this.callBackReport(report));
    }

    callBackReport(report: any) {
        this.baseService.rportData(report);
    }

    deleteStudent(event: any) {
        var obj = JSON.parse(event.target.value);
        if(obj.active === true) {
            this.baseService.showInfoWarning("Are you sure you want to deactivate the user?","Deactive!", 'warning')
            obj.active = false;
        } else {
            this.baseService.showInfoWarning("Are you sure you want to activate the user?","Active!", 'warning')
            obj.active = true;
        }
        this.student_to_delete = obj;
    }

    request_warning() {
        this.baseService.showInfoWarning("Are you Sure Want to reset password", "Reset Password", 'warning');
    }

    confirmDelete() {
        if(this.student_to_delete != undefined) {
            this.commonService.deleteStudent(this.student_to_delete)
                .then(data => this.callBackSuccessDelete(data))
                .catch(err => this.callBackErrorDelete(err));
        }
    }

    callBackSuccessDelete(data: any) {
        this.baseService.showInformation('top', this.messages.update_success, this.constants.n_success);
        this.baseService.enableDivLoading('.datatable-student', this.constants.updating);
        var thisObj = this;
        setTimeout(function () {
            thisObj.baseService.dataTableReload('datatable-student');
            thisObj.baseService.disableDivLoading('.datatable-student');
        }, 1000)
    }

    callBackErrorDelete(err: any) {
        this.baseService.showInformation('top', this.messages.delete_err, this.constants.n_info);
    }

    reload(){
        this.baseService.dataTableReload('datatable-student');
    }

    resetPwd(event: any) {
        this.student_to_delete = undefined;
        var value = event.target.value;
        if(value.length > 0) {
            var obj = JSON.parse(event.target.value)
            this.commonService.post(this.serviceUrls.resetPwd, obj).then(
                result => this.resetPwdCallback(result, false),
                error => this.resetPwdCallback(<any>error, true));
        }
    }

    resetPwdCallback(result: any, err: boolean) {
        if(err) {
            this.baseService.showNotification('Failure!', result, 'bg-danger');
        } else {
            this.baseService.clearText('#resetPwd');
            this.baseService.showNotification('Success!', result.message, 'bg-success');
        }
    }

    checkRoleToResetPwd(event: any) {
        if(!this.baseService.checkRoleToResetPwd()) {
            this.baseService.hideColumn('.datatable-student', [8]);
        }
    }

}