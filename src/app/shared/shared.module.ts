import {IsPrimaryVrmPipe} from '../pipes/IsPrimaryVrmPipe';
import {NgModule} from '@angular/core';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
import {KeysPipe} from '@app/pipes/keysPipe';
import {FilterRecordPipe} from '@app/pipes/FilterRecordPipe';
import { AdrReasonModalComponent } from './adr-reason-modal/adr-reason-modal.component';

@NgModule({
  declarations: [ IsPrimaryVrmPipe, KeysPipe, FilterRecordPipe, PageNotFoundComponentComponent, AdrReasonModalComponent ],
  exports: [
    IsPrimaryVrmPipe, KeysPipe, FilterRecordPipe, PageNotFoundComponentComponent, AdrReasonModalComponent
  ],
  entryComponents: [ AdrReasonModalComponent ],
})
export class SharedModule {}
