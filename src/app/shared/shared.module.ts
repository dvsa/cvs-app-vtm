import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {DefaultNullOrEmpty} from '@app/pipes/DefaultNullOrEmptyPipe';
import {FilterRecordPipe} from '@app/pipes/FilterRecordPipe';
import {KeysPipe} from '@app/pipes/keysPipe';
import {OrderByStatusPipe} from '@app/pipes/OrderByStatusPipe';
import {IsPrimaryVrmPipe} from '../pipes/IsPrimaryVrmPipe';
import {AdrReasonModalComponent} from './adr-reason-modal/adr-reason-modal.component';
import {ErrorSummaryComponent} from './error-summary/error-summary.component';
import {PageNotFoundComponentComponent} from './page-not-found-component/page-not-found-component.component';
import {PendingChangesService} from './pending-changes-service/pending-changes.service';
import {PreventLeavePageModalComponent} from './prevent-page-leave-modal/prevent-leave-page-modal.component';
import {SortByDatePipe} from '@app/pipes/SortByDatePipe';


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
  SortByDatePipe
];

@NgModule({
  imports: [
    FormsModule,
    MatDialogModule,
    CommonModule
  ],
  declarations: PIPES_AND_COMPONENTS,
  exports: PIPES_AND_COMPONENTS,
  entryComponents: [AdrReasonModalComponent, PreventLeavePageModalComponent],
  providers: [FilterRecordPipe, PendingChangesService],
})
export class SharedModule {
}
