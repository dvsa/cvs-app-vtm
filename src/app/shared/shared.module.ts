import {IsPrimaryVrmPipe} from '../pipes/IsPrimaryVrmPipe';
import {NgModule} from '@angular/core';
import { PageNotFoundComponentComponent } from './components/page-not-found-component/page-not-found-component.component';
import {KeysPipe} from '@app/pipes/keysPipe';

@NgModule({
  declarations: [ IsPrimaryVrmPipe, KeysPipe, PageNotFoundComponentComponent ],
  exports: [
    IsPrimaryVrmPipe, KeysPipe, PageNotFoundComponentComponent
  ]
})
export class SharedModule {}
