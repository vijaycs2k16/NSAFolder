/**
 * Created by Sai Deepak on 05-Mar-17.
 */
import { NgModule } from '@angular/core';

import { FeeReportsRoutingModule } from "./fee-reports.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { FeeReportsComponent} from '../../../index';
import { TreeModule, SharedModule} from "primeng/primeng";

@NgModule({

    imports: [
        TreeModule, SharedModule, AppSharedModule,
        FeeReportsRoutingModule
    ],
    exports: [],
    declarations: [FeeReportsComponent],
    providers: [],
})
export class FeeReportsModule { }