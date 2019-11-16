import {IsPrimaryVrmPipe} from '../pipes/IsPrimaryVrmPipe';
import {NgModule} from '@angular/core';
import { PageNotFoundComponentComponent } from './components/page-not-found-component/page-not-found-component.component';

@NgModule({
  declarations: [ IsPrimaryVrmPipe, PageNotFoundComponentComponent ],
  exports: [
    IsPrimaryVrmPipe, PageNotFoundComponentComponent
  ]
})
export class SharedModule {}
