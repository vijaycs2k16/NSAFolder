/**
 * Created by Deepa on 7/30/2018.
 */
/**
 */
import {Component, OnInit, Input,ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls, Constants} from "../../../../common/index";
import {FormBuilder, Validators} from "@angular/forms";
import {AddSyllabusComponent} from "./add-syllabus/add-syllabus.component";
import {AttachmentComponent} from "../../common/attachment/attachment.component";

@Component({
    templateUrl: 'syllabus.html'
})

export class SyllabusComponent implements OnInit {

    @ViewChild(AddSyllabusComponent) addSyllabusComponent: AddSyllabusComponent;
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;


    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Syllabus');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.syllabus);
    }


    addSyllabus(event: any) {
        this.addSyllabusComponent.addSyllabus(event)
    }

    editSyllabus(event:any) {
        this.addSyllabusComponent.getEditSyllabus(event, this);

    }
    request_delete_warning() {
        this.baseService.showWarning();
    }


    request_delete(event:any) {
        var value = event.target.value
        console.log('value',value)
        if(value) {
            this.commonService.deleteObject(this.serviceUrls.deleteSyllabusByClass + JSON.parse(value).classId, value, 'datatable-syllabus');
            this.reload();
        }

    }

    reload() {
        this.baseService.dataTableReload('datatable-syllabus');
    }

}