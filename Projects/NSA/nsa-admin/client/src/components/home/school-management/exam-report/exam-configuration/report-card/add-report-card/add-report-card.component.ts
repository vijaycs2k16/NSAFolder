import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ReportCardComponent} from "../report-card.component";
import {CommonService} from "../../../../../../../services/common/common.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls, Constants} from "../../../../../../../common/index";
import {TreeService} from "../../../../../../../services/tree/tree.service";
import { BaseService } from '../../../../../../../services/index';
declare var _: any;

@Component({
    selector: 'add-report-card',
    templateUrl: 'add-report-card.html'
})



export class AddReportCardComponent implements OnInit {

    selectedClass: any = [];
    sectionId: any;
    classId: any;
    className: any;
    class: any;
    section: any;
    sectionName: any;
    editClass: any = true;
    examTypes: any[];
    terms: any;
    termId: any;
    termName: any;
    visibility: boolean = false;
    reportType: any;


    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private treeService: TreeService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA-add-report-card');
        //this.getClassNames();
        //this.createReportType();
        this.emptyData();
        this.baseService.addHideClass('#term');
        this.baseService.addHideClass('#exam');
    }

    @ViewChild('classSelect') classSelect: ElementRef;
    @ViewChild('sectionSelect') sectionSelect: ElementRef;
    @ViewChild('SelectTerm') termSelect: ElementRef;
    @ViewChild('SelectReportType') reportSelect: ElementRef;


    openOverlay(event: any) {
        this.editClass = true;
        this.baseService.openOverlay(event)
    }

    addReportCard(event: any) {
        this.openOverlay(event);
    }

    categoryCallback(result: any, err: any) {
        this.baseService.enableMultiSelectFilteringAll('.select-class', result, this.constants.classNameObj   , this.selectedClass);
    }

    closeOverlay(event:any) {
        this.emptyData();
        this.baseService.closeOverlay('#addReportCard');
    }

    setValidations() : any {
        var dataFound = false;
        this.className = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions);
        this.classId = this.baseService.extractOptionValue(this.classSelect.nativeElement.selectedOptions);
        this.sectionName = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions);
        this.sectionId = this.baseService.extractOptionValue(this.sectionSelect.nativeElement.selectedOptions);
        this.termName = this.baseService.extractOptions(this.termSelect.nativeElement.selectedOptions);
        this.termId = this.baseService.extractOptionValue(this.termSelect.nativeElement.selectedOptions);
        if(this.className[0].id.length < 1) {
            this.baseService.showNotification("Please select the Class.", "", this.constants.j_danger);
        } else if(this.sectionName[0].id.length < 1) {
            this.baseService.showNotification("Please select the Section.", "", this.constants.j_danger);
        } else if(this.termName[0].id.length < 1){
            this.baseService.showNotification("Please select the term.", "", this.constants.j_danger);
        } else {
            dataFound = true;
        }
        return dataFound;
    }


    emptyData() {
        this.classId = ''
        this.getClassNames();
        this.createReportType();
        this.baseService.addHideClass('#term');
    }

    getClassNames() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            result => this.classCallback(result, false),
            error => this.classCallback(<any>error, true))
    }

    classCallback(result: any, err: any) {
        this.baseService.enableSelectWithLabel('#select-class', result, this.constants.classObj,'Select Class', null);
    }


    getSectionByClass() {
        this.sectionId = ''
        var classObj = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0];
        this.classId = classObj.id;
        this.className = classObj.name
        if(this.classId.length > 0) {
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
                this.baseService.removeHideClass('#select-section');
        }
    }

    callbacks(value: any) {
        this.section = value;
        this.baseService.enableSelectWithLabel('.select-section', this.section, this.constants.sectionObj,'Select Section', 'Select Section')
    }

    createReportType() {
        var reportType = [{value: 'term', name: 'Termwise'}]
            //{value: 'exam' , name: 'Examwise'}]
        this.baseService.enableSelectWithEmpty('#report-Type', reportType, [ 'name', 'value' ], null);
    }

    callBackSections(result: any) {
       this.baseService.enableSelectWithLabel('#select-section', result, this.constants.sectionObj, 'Select Section', null);
    }


    getExamdetail(event: any){
        if(event.target.value == 'term') {
           this.getTerms();
           this.baseService.addHideClass('#exam');
           this.baseService.removeHideClass('#term');
           this.baseService.removeHideClass('#publishParent');
        }else if(event.target.value == 'exam'){
           this.getExams();
           this.baseService.addHideClass('#term');
           this.baseService.removeHideClass('#exam');
            this.baseService.addHideClass('#publishParent');
        } else {
           this.baseService.addHideClass('#term');
           this.baseService.addHideClass('#exam');
        }
    }

    getTerms() {
        var sectionObj = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0];
        this.sectionId = sectionObj.id;
        this.sectionName = sectionObj.name;
        if(this.sectionId.length > 0) {
            this.commonService.get(this.serviceUrls.examTermByClassAndSection + this.classId + '/' + this.sectionId).then(
                result => this.termsCallback(result, false),
                error => this.termsCallback(<any>error, true))
        }
    }

    termsCallback(result: any, err: any) {
        this.baseService.enableSelectWithEmpty('#term-name', result, this.constants.termsObj, null);
    }

    getExams() {
        this.commonService.get(this.serviceUrls.examType).then(result => this.callBackExamType(result, null));
    }

    callBackExamType(result: any, err: any) {
        this.baseService.enableSelectWithEmpty('#exam-name', result, this.constants.examSchedule, null);
    }

    publishParent (event: any) {
        if(this.setValidations()) {
            this.baseService.enableLoadingWithMsg('')
            var termObj1 = this.baseService.extractOptions(this.termSelect.nativeElement.selectedOptions)[0];
            var termObj = _.filter(this.terms, {"id": termObj1.id});
            this.termId = termObj1.id;
            this.termName = termObj.name;
            this.commonService.post(this.serviceUrls.printConsolidate + '/' + this.termId + '/' + this.classId + '/' + this.sectionId, termObj1).then(report => this.callBackReport(report, event, false),
                error => this.callBackReport(<any>error, event, true));
        }
    }

    generateTeacher (event: any) {
        //this.baseService.enableLoadingWithMsg('')
        //var termObj1 = this.baseService.extractOptions(this.termSelect.nativeElement.selectedOptions)[0];
        //var termObj = _.filter(this.terms, {"id" : termObj1.id });
        //this.termId = termObj1.id;
        //this.termName = termObj.name;
        //this.commonService.post(this.serviceUrls.printConsolidate +  '/' +  this.termId +  '/' + this.classId + '/' + this.sectionId + '?classId=' + this.classId + '&sectionId=' + this.sectionId + '&startDate=' + termObj[0].startDate  + '&endDate=' + termObj[0].endDate , termObj[0]).then(report => this.callBackReport(report));
    }

    callBackReport(report: any, event: any, error: boolean) {
        if(!error){
            this.baseService.showNotification('Consolidate Marksheet is generated.', '', 'bg-success');
            this.baseService.dataTableReload('datatable-report-card');
            this.closeOverlay('#addReportCard');
        } else {
            var message = report ? report : 'Consolidate Marksheet is not generated.'
            this.baseService.showNotification(message, '', 'bg-danger');
        }
        this.baseService.disableLoading();
    }

}