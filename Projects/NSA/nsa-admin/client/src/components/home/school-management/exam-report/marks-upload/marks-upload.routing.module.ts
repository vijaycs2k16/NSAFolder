/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarksUploadComponent} from "./marks-upload.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: MarksUploadComponent}
        ])
    ],
    exports: [RouterModule],
})
export class MarksUploadRoutingModule { }