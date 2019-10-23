import {NgModule} from '@angular/core';
import {IsPrimaryVrmPipe} from './pipes/IsPrimaryVrmPipe';

@NgModule({
  declarations: [
    IsPrimaryVrmPipe
  ],
  exports: [
    IsPrimaryVrmPipe
  ]
})

export class PipeModule { }
