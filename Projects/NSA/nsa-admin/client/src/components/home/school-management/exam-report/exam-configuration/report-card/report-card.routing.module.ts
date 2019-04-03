/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportCardComponent} from "./report-card.component"

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ReportCardComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ReportCardRoutingModule{ }