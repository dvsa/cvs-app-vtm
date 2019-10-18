import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TechnicalRecordComponent } from "./technical-record/technical-record.component"
import { LandingPageComponent } from "@app/landing-page/landing-page.component";

import { TechnicalRecordService } from './technical-record/technical-record.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxDataTableModule } from '@app/shared/ngx-data-table/ngx-data-table.module';
import { ComponentsRoutingModule } from "@app/components/components-routing.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgxJsonViewerModule,
    NgxDataTableModule,
    ComponentsRoutingModule,
    IonicModule.forRoot(),
    FormsModule,
  ],
  declarations: [
    TechnicalRecordComponent, LandingPageComponent
  ],
  exports: [
    TechnicalRecordComponent, LandingPageComponent
  ],
  providers: [TechnicalRecordService],
  entryComponents: [],
})
export class ComponentsModule {}
