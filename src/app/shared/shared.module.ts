import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { AdrReasonModalComponent } from './adr-reason-modal/adr-reason-modal.component';
import { DateInputComponent } from './components/date-input/date-input.component';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
import { PreventLeavePageModalComponent } from './prevent-page-leave-modal/prevent-leave-page-modal.component';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';

import { FilterRecordPipe } from '@app/pipes/FilterRecordPipe';
import { OrderByStatusPipe } from '@app/pipes/OrderByStatusPipe';
import { IsPrimaryVrmPipe } from '../pipes/IsPrimaryVrmPipe';
import { DefaultNullOrEmpty } from '@app/pipes/DefaultNullOrEmptyPipe';
import { PendingChangesService } from './pending-changes-service/pending-changes.service';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { SortByDatePipe } from '@app/pipes/SortByDatePipe';
import { FormConnectorDirective } from '@app/directives/form-connector/form-connector.directive';
import { FilterMultipleRecordsPipe } from '@app/pipes/FilterMultipleRecordsPipe';
import { BackButtonDirective } from '@app/shared/directives/back-button.directive';
import { DisplayByDelimiter } from '@app/pipes/display-by-delimiter';
import { CapitalizeString } from '@app/pipes/capitalize-string';

export const PIPES_AND_COMPONENTS = [
  AdrReasonModalComponent,
  DateInputComponent,
  PageNotFoundComponentComponent,
  PreventLeavePageModalComponent,
  ErrorSummaryComponent,
  FormConnectorDirective,

  IsPrimaryVrmPipe,
  FilterRecordPipe,
  DisplayOptionsPipe,
  OrderByStatusPipe,
  DefaultNullOrEmpty,
  SortByDatePipe,
  FilterMultipleRecordsPipe,
  BackButtonDirective,
  DisplayByDelimiter,
  CapitalizeString
];

@NgModule({
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatDialogModule],
  declarations: PIPES_AND_COMPONENTS,
  exports: PIPES_AND_COMPONENTS,
  entryComponents: [AdrReasonModalComponent, PreventLeavePageModalComponent],
  providers: [FilterRecordPipe, PendingChangesService]
})
export class SharedModule {}
