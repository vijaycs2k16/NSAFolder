import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ReportCardComponent} from "../report-card.component";
import {CommonService} from "../../../../../../../services/common/common.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls, Constants} from "../../../../../../../common/index";
import {TreeService} from "../../../../../../../services/tree/tree.service";
import { BaseService } from '../../../../../../../services/index';
declare var _: any;

@Component({
    selector: 'generate-report-card',
    templateUrl: 'generate-report-card.html'
})



export class GenReportCardComponent implements OnInit {

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
    subjects: any;
    students: any;
    visibility: boolean = false;
    dataObj : any
    btnEnable: boolean = false;


    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private treeService: TreeService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA-add-report-card');
        this.btnEnable = this.baseService.haveBtnPermissions(this.constants.REPORTCARD_PERMISSIONS, this.constants.SEND);

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
        var value = JSON.parse(event.target.value);
        this.dataObj = value
        if(value) {
            this.commonService.post(this.serviceUrls.printTConsolidate + '/' + value.termId + '/' + value.classId + '/' + value.sectionId, value).then(report => this.categoryCallback(report, event, false),
            error => this.categoryCallback(<any>error, event, true));
        } else {
            this.baseService.showNotification("No Report Generated", "", "bg-danger")
        }

    }

    categoryCallback(result: any, event: any, error:boolean) {
        if(error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.dynamicTable(result);
            this.openOverlay(event);
        }

    }

    publishUpdate(event: any){
        var value = this.dataObj;
        if(value) {
            this.commonService.put(this.serviceUrls.updateReportCard, value).then(
                result => this.publishEventCallback(result,false),
                error => this.publishEventCallback(<any>error, true))
        }
    }

    publishEventCallback(result: any, err: any) {
        if (err) {
            this.baseService.showNotification("Report Card is not published.", "", 'bg-danger');
        } else {
            this.baseService.showNotification("Report Card is published.", "", 'bg-success');
        }
        this.reload();
        this.closeOverlay();

    }



    closeOverlay() {
        this.baseService.closeOverlay('#genReportCard');
    }

    reload() {
        this.baseService.dataTableReload('datatable-report-card');
    }

}