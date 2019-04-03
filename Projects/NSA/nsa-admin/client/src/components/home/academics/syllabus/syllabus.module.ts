/**
 * Created by Deepa on 7/30/2018.
 */


/**
 * Created by anjan on 8/1/2017.
 */
import { NgModule } from '@angular/core';
import { SyllabusRoutingModule } from './syllabus.routing.module';
import { SyllabusComponent } from "../syllabus/syllabus.component";

import { AddSyllabusComponent } from "./add-syllabus/add-syllabus.component";
import {AppSharedModule} from "../../../shared/shared.module";
import {AttachmentComponent} from "../../common/attachment/attachment.component";


@NgModule({
    imports: [AppSharedModule,
        SyllabusRoutingModule
    ],
    exports: [],
    declarations: [SyllabusComponent, AddSyllabusComponent ],
    providers: [],
})

export class SyllabusModule { }