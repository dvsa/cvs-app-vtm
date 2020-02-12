import {IsPrimaryVrmPipe} from '../pipes/IsPrimaryVrmPipe';
import {NgModule} from '@angular/core';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
import {KeysPipe} from '@app/pipes/keysPipe';
import {FilterRecordPipe} from '@app/pipes/FilterRecordPipe';
import { AdrReasonModalComponent } from './adr-reason-modal/adr-reason-modal.component';
import {OrderByStatusPipe} from '@app/pipes/OrderByStatusPipe';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {DefaultNullOrEmpty} from '@app/pipes/DefaultNullOrEmptyPipe';


export const PIPES_AND_COMPONENTS = [
  IsPrimaryVrmPipe,
  KeysPipe,
  FilterRecordPipe,
  PageNotFoundComponentComponent,
  AdrReasonModalComponent,
  OrderByStatusPipe,
  DefaultNullOrEmpty
];

@NgModule({
  imports: [
    FormsModule,
    MatDialogModule
  ],
  declarations: PIPES_AND_COMPONENTS,
  exports: PIPES_AND_COMPONENTS,
  entryComponents: [ AdrReasonModalComponent ],
  providers: [FilterRecordPipe],
})
export class SharedModule {}
