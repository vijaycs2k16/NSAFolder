
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGroupsComponent} from "./user-groups.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: UserGroupsComponent}
        ])
    ],
    exports: [RouterModule],
})
export class UserGroupsRoutingModule { }