import {IsPrimaryVrmPipe} from '../pipes/IsPrimaryVrmPipe';
import {NgModule} from '@angular/core';
import { PageNotFoundComponentComponent } from './components/page-not-found-component/page-not-found-component.component';
import {KeysPipe} from '@app/pipes/keysPipe';
import {FilterRecordPipe} from '@app/pipes/FilterRecordPipe';

@NgModule({
  declarations: [ IsPrimaryVrmPipe, KeysPipe, FilterRecordPipe, PageNotFoundComponentComponent ],
  exports: [
    IsPrimaryVrmPipe, KeysPipe, FilterRecordPipe, PageNotFoundComponentComponent
  ]
})
export class SharedModule {}
