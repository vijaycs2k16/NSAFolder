/**
 * Created by maggi on 24/05/17.
 */
import {NgModule} from "@angular/core";
import {AppSharedModule} from "../../../../../shared/shared.module";
import {ReportCardRoutingModule} from "./report-card.routing.module";
import {ReportCardComponent} from "./report-card.component";
import {AddReportCardComponent} from "./add-report-card/add-report-card.component";
import {GenReportCardComponent} from "./generate-report-card/generate-report-card.component";

@NgModule({

    imports: [
        AppSharedModule,
        ReportCardRoutingModule
    ],
    exports: [],
    declarations: [ReportCardComponent, AddReportCardComponent, GenReportCardComponent],
    providers: [],
})

export class ReportCardModule { }
