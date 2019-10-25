import {IsPrimaryVrmPipe} from '../pipes/IsPrimaryVrmPipe';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [ IsPrimaryVrmPipe ],
  exports: [
    IsPrimaryVrmPipe
  ]
})
export class SharedModule {}
