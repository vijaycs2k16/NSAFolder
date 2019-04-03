
import { NgModule } from '@angular/core';

import { UserGroupsRoutingModule } from "./user-groups.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { UserGroupsComponent } from "../user-groups/user-groups.component";
import {AddUserGroupsComponent} from "./add-user-groups/add-user-groups.component";
import { TreeModule, SharedModule} from "primeng/primeng";

@NgModule({

    imports: [
        AppSharedModule,
        UserGroupsRoutingModule,
        TreeModule, SharedModule
    ],
    exports: [],
    declarations: [UserGroupsComponent,AddUserGroupsComponent],
    providers: [],
})
export class UserGroupsModule { }