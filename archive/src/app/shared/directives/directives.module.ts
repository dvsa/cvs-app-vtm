import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BackButtonDirective } from './back-button.directive';
import { NullValueDirective } from './null-value.directive';

export const PIPES_AND_COMPONENTS = [BackButtonDirective, NullValueDirective];

@NgModule({
  imports: [CommonModule],
  declarations: PIPES_AND_COMPONENTS,
  exports: PIPES_AND_COMPONENTS
})
export class DirectivesModule {}
