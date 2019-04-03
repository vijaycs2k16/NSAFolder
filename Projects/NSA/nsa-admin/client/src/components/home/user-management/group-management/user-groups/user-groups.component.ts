import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";
import {AddUserGroupsComponent} from "./add-user-groups/add-user-groups.component"

@Component({
    templateUrl: 'user-groups.html'
})
export class UserGroupsComponent implements OnInit {

    @ViewChild(AddUserGroupsComponent) addUserGroupsComponent: AddUserGroupsComponent;

    constructor(private baseService:BaseService,
                private serviceUrls:ServiceUrls,
                private commonService:CommonService,
                private constants:Constants,
                private messages:Messages) {

    }

    ngOnInit() {
        this.baseService.enableAppJs();
        var constId = '00000000-0000-0000-0000-000000000000';
    }

    addUserGroups(events: any){
        this.addUserGroupsComponent.addUserGroups(events)
    }

    editGroupUsers(events: any){
        this.addUserGroupsComponent.editUserGroups(events)
    }

    resetDatatable() {
        this.baseService.dataTableDestroy('datatable-user-group');
        //var constId = '00000000-0000-0000-0000-000000000000';
        //var url = this.serviceUrls.getGroupDetails + constId ;
        //this.baseService.enableDataTable(url);
    }

    request_delete_warning() {
        this.baseService.showWarning();
    }

    request_delete(event:any) {
        var value = event.target.value
        if(value) {
            this.commonService.deleteObject(this.serviceUrls.deleteGroupDetails + JSON.parse(value).id, value, 'datatable-user-group');
        }

    }
}