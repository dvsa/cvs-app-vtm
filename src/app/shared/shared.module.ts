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
import { DisplayByDelimiter } from '@app/pipes/display-by-delimiter';
import { CapitalizeString } from '@app/pipes/capitalize-string';
import { DialogBoxComponent } from '@app/shared/dialog-box/dialog-box.component';
import { DirectivesModule } from '@app/shared/directives/directives.module';
import { DialogBoxConfirmationComponent } from '@app/shared/dialog-box-confirmation/dialog-box-confirmation.component';

export const PIPES_AND_COMPONENTS = [
  AdrReasonModalComponent,
  DateInputComponent,
  PageNotFoundComponentComponent,
  PreventLeavePageModalComponent,
  ErrorSummaryComponent,
  FormConnectorDirective,
  DialogBoxComponent,
  DialogBoxConfirmationComponent,

  IsPrimaryVrmPipe,
  FilterRecordPipe,
  DisplayOptionsPipe,
  OrderByStatusPipe,
  DefaultNullOrEmpty,
  SortByDatePipe,
  FilterMultipleRecordsPipe,
  DisplayByDelimiter,
  CapitalizeString
];

@NgModule({
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatDialogModule, DirectivesModule],
  declarations: PIPES_AND_COMPONENTS,
  exports: [PIPES_AND_COMPONENTS, DirectivesModule],
  entryComponents: [AdrReasonModalComponent, PreventLeavePageModalComponent, DialogBoxComponent, DialogBoxConfirmationComponent],
  providers: [FilterRecordPipe, PendingChangesService]
})
export class SharedModule {}
