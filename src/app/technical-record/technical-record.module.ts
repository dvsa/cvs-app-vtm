import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalRecordComponent } from './technical-record.component';
import { TechnicalRecordService } from './technical-record.service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    NgxJsonViewerModule,
    HttpClientModule,
    CommonModule
  ],
  declarations: [TechnicalRecordComponent],
  exports: [
    TechnicalRecordComponent
  ],
  providers: [TechnicalRecordService]
})
export class TechnicalRecordModule { }
