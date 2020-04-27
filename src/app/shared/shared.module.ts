import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DefaultNullOrEmpty } from '@app/pipes/DefaultNullOrEmptyPipe';
import { FilterRecordPipe } from '@app/pipes/FilterRecordPipe';
import { KeysPipe } from '@app/pipes/keysPipe';
import { OrderByStatusPipe } from '@app/pipes/OrderByStatusPipe';
import { IsPrimaryVrmPipe } from '../pipes/IsPrimaryVrmPipe';
import { AdrReasonModalComponent } from './adr-reason-modal/adr-reason-modal.component';
import { ErrorSummaryComponent } from './error-summary/error-summary.component';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
import { PendingChangesService } from './pending-changes-service/pending-changes.service';
import { PreventLeavePageModalComponent } from './prevent-page-leave-modal/prevent-leave-page-modal.component';
import { SortByDatePipe } from '@app/pipes/SortByDatePipe';
import { DialogBoxComponent } from '@app/shared/dialog-box/dialog-box.component';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { DialogBoxConfirmationComponent } from '@app/shared/dialog-box-confirmation/dialog-box-confirmation.component';
import { TimeInputComponent } from '@app/shared/components/time-input/time-input.component';

export const PIPES_AND_COMPONENTS = [
  IsPrimaryVrmPipe,
  KeysPipe,
  FilterRecordPipe,
  PageNotFoundComponentComponent,
  AdrReasonModalComponent,
  PreventLeavePageModalComponent,
  OrderByStatusPipe,
  DefaultNullOrEmpty,
  ErrorSummaryComponent,
  SortByDatePipe,
  DialogBoxComponent,
  DisplayOptionsPipe,
  DialogBoxConfirmationComponent
];

@NgModule({
  imports: [FormsModule, MatDialogModule, CommonModule],
  declarations: PIPES_AND_COMPONENTS,
  exports: PIPES_AND_COMPONENTS,
  entryComponents: [
    AdrReasonModalComponent,
    PreventLeavePageModalComponent,
    DialogBoxComponent,
    DialogBoxConfirmationComponent
  ],
  providers: [FilterRecordPipe, PendingChangesService]
})
export class SharedModule {}
