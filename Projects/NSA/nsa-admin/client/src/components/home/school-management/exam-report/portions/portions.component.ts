/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../services/index";

@Component({
    templateUrl: 'portions.html'
})
export class PortionsComponent implements OnInit {
    constructor(private baseService: BaseService) { }
    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        /*this.baseService.enableDataTableExample();*/
        //this.baseService.enableSelect();
        /*this.baseService.enableDataTable();*/
    }
}