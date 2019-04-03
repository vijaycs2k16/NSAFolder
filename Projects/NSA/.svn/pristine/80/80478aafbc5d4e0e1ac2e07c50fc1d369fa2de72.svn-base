/**
 * Created by Ramkumar on 1-Dec-18.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../../../common/index";
import {CommonService} from "../../../../../../../../services/common/common.service";
declare var jQuery: any;
declare var _: any;

@Component({
    selector: 'student-performance',
    templateUrl: 'student-performance.html'
})

export class StudentPerformanceComponent implements OnInit {


    subjectObjs : any [] = [];
    markObjs : any [] = [];
    classId: any;
    classes: any;
    sections : any[] = [];
    exams: any;
    students : any;
    sId: any;
    sectionId: any;
    className: any;
    sectionName: any;
    examId: any;
    examName: any;
    subjects: any[] = [];
    examScheduleId: any
    subjectId: any
    ranges: any[] = []
    rangeValues: any[] = []
    gradeObj: any
    gradeDistributionObjs: any[] = []
    overAllChart: any
    subjectwiseChart: any
    examwiseChart: any
    enable: boolean
    subjectName:any
    pieHide: boolean

    @ViewChild('classSelect') classSelect: ElementRef;
    @ViewChild('sectionSelect') sectionSelect: ElementRef;
    @ViewChild('examSelect') examSelect: ElementRef;
    @ViewChild('usersSelect') usersSelect: ElementRef;
    @ViewChild('singleClass') singleClass: ElementRef;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.getClass();
        this.getActiveClasses();
        this.pieHide = false;
    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
    }

    getClass() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            result => this.classCallback(result, false),
            error => this.classCallback(<any>error, true))
    }

    classCallback(result: any, err: any) {
        this.sections = result;
        this.baseService.enableSelectWithLabel('#class-name-select1', result, this.constants.classObj,'Select Class', null);

    }

    closeOverlay() {
        this.pieHide = true;
        this.baseService.closeOverlay("#student-performance");
    }

    getSectionByClass() {

        var classObj = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0];
       this.classId = classObj.id;
       this.className = classObj.name
        if(this.classId.length > 0) {
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
            this.baseService.removeHideClass('#section-name-select1');
        } else {
            this.baseService.addHideClass('#section-name-select1');
        }
    }

    callBackSections(result: any) {
       this.sections = result;
        this.baseService.enableSelectWithLabel('#section-name-select1', result, this.constants.sectionObj, 'Select Section', null);
    }


    getExamsByClassAndSections() {

        var sectionObj = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0];
        this.sectionId = sectionObj.id;
        this.sectionName = sectionObj.name;

        if(this.sectionId.length > 0) {

            this.commonService.get(this.serviceUrls.student +  "class/" + this.classId + '/section/' +this.sectionId).then(
                result => this.studentCallback(result, false),
                error => this.studentCallback(<any>error, true))

        //     this.commonService.get(this.serviceUrls.examScheduleByClassAndSection + this.classId + '/' + this.sectionId).then(
        //         result => this.examsCallback(result, false),
        //         error => this.examsCallback(<any>error, true))
        //
         }

    }

    getExamsByStudent() {

        this.baseService.disableEcharts('subjectWiseReports');
        this.baseService.disableEcharts('examwisereports');
        this.markObjs = [];
        this.pieHide = true;

        if(this.sectionId.length > 0) {
            this.commonService.get(this.serviceUrls.PublishedexamByClassAndSection + this.classId + '/' + this.sectionId).then(
                result => this.examsCallback(result, false),
                error => this.examsCallback(<any>error, true))

        }
    }

    examsCallback(result: any, err: any) {
        this.exams = result.writtenExamName;
        this.baseService.enableSelectWithEmpty('#exam-name-select1', result, this.constants.examSchedule, null);
    }

    studentCallback(result: any, err: any) {
        this.students = result;
        this.getExamsByStudent();
        this.baseService.enableSelectWithEmpty('#name-select1', result, this.constants.classEmpObj, null);
    }


    show(event:any) {
        this.baseService.enableLoadingWithMsg('');
        this.getClass();
        this.getActiveClasses();
        this.baseService.enableSelectWithEmpty('#class-name-select1', this.classes, this.constants.classObj, null);
        this.baseService.enableSelectWithEmpty('#section-name-select1', this.sections, this.constants.sectionsObj, null);
        this.baseService.enableSelectWithEmpty('#name-select1', this.students, this.constants.classEmpObj, null);
        this.baseService.enableSelectWithEmpty('#exam-name-select1', this.exams, this.constants.examSchedule, null);

        this.baseService.openOverlay(event);
        this.baseService.disableLoading();
        this.resetForm();
    }



    callbackGradeStats(data: any, err: boolean) {
     this.getOverAllReportsByUser();
        if(err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.markObjs = data.subjectMarkDetails
            this.ranges = data.ranges
            this.rangeValues = data.values
            this.baseService.enableC3('#subjectWiseReports', data, 'Subjects', 'Marks')
            this.baseService.disableLoading()

        }
    }

    onSubjectChange() {
        this.baseService.enableLoadingWithMsg('')
        this.examId = this.baseService.extractOptions(this.examSelect.nativeElement.selectedOptions)[0].id;
        this.sId = this.baseService.extractOptions(this.usersSelect.nativeElement.selectedOptions)[0].id;
        this.commonService.get(this.serviceUrls.getuserStatsBySub + this.sId + '/' + this.examId).then(
            result => this.callbackGradeStats(result, false),
            error => this.callbackGradeStats(<any>error, true))
    }



    getOverAllReportsByUser() {
        this.sId = this.baseService.extractOptions(this.usersSelect.nativeElement.selectedOptions)[0].id;

        this.commonService.get(this.serviceUrls.getOverallByUser + this.sId).then(
            result => this.ExamwisePerformance(result, false),
            error => this.ExamwisePerformance(<any>error, true))

        this.commonService.get(this.serviceUrls.getOverallSubByUser + this.sId).then(
            result => this.SubjectwisePerformance(result, false),
            error => this.SubjectwisePerformance(<any>error, true))

    }


    resetForm() {
        this.sections = [],
        this.exams = [],
        this.students = [],
        this.baseService.enableSelectWithEmpty('#class-name-select1', this.classes, this.constants.classObj, null);
        this.baseService.enableSelectWithEmpty('#section-name-select1', this.sections, this.constants.sectionsObj, null);
       this.baseService.enableSelectWithEmpty('#name-select1', this.students, this.constants.classEmpObj, null);
       this.baseService.enableSelectWithEmpty('#exam-name-select1', this.exams, this.constants.examSchedule, null);
        this.baseService.disableEcharts('subjectWiseReports');
        this.baseService.disableEcharts('examwisereports');
        //this.baseService.disableEcharts('c3-pie-chart');
        this.markObjs = [];
    }

    clear(value: any){
        this.resetForm();
        this.pieHide = true;

    }


    showSubwiseGraph(id: any) {
        var content = 'Marks obtained in each subject by the student in the exam specified is plotted in this graph'
        this.baseService.enablePopOver('#' + id, 'Subject-wise Graph', content, 'bottom')
    }

    showMarkDetails(id: any) {
        var content = 'Marks obtained in each subject by the student in the exam specified is listed in this table.'
        this.baseService.enablePopOver('#' + id, 'Marks', content, 'bottom')
    }

    showSubwiseExamsOverall(id: any) {
        var content = 'The pie charts below depicts the subject-wise performance of the student in each exam that has been conducted'
        this.baseService.enablePopOver('#' + id, 'Subject-wise Performance', content, 'bottom')


    }

    showExamwiseOverall(id: any) {
        var content = 'The overall performance of the student in each exam is plotted in this graph'
        this.baseService.enablePopOver('#' + id, 'Exam-wise Overall Performance', content, 'bottom')


    }


    ExamwisePerformance(data: any, err: boolean) {

        if (err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.ranges = data.ranges
            this.rangeValues = data.values
            this.examwiseChart = this.baseService.enableC3('#examwisereports', data, 'Exams', 'GradePoints')

            this.baseService.disableLoading()
        }

    }
        SubjectwisePerformance(data: any, err: boolean ) {
            if(err) {
                this.baseService.showNotification(data, "", 'bg-danger');
            } else {
                this.subjectObjs = data
                this.ranges = data.ranges
                var self = this;
                setTimeout(function () {
                    for(var i=0 ; i<self.subjectObjs.length ; i++) {
                      // if(self.subjectObjs[i].marks_obtained > 0) {
                           self.subjectName = data[i].subject_name;
                           self.baseService.enableD3('#c3-pie-chart' + i, self.subjectObjs[i], self.subjectName)
                       //}
                    }
                })
                this.pieHide = false;
                this.baseService.disableLoading()
            }


        }


}