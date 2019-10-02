import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {TechnicalRecordComponent} from "./technical-record/technical-record.component"

import { TechnicalRecordService } from './technical-record/technical-record.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxDataTableModule } from '@app/shared/ngx-data-table/ngx-data-table.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgxJsonViewerModule,
    NgxDataTableModule,
    IonicModule.forRoot(),
  ],
  declarations: [
    TechnicalRecordComponent
  ],
  exports: [
    TechnicalRecordComponent
  ],
  providers: [TechnicalRecordService],
  entryComponents: [],
})
export class ComponentsModule {}
