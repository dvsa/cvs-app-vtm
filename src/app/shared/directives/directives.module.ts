import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackButtonDirective } from '@app/shared/directives/back-button.directive';

export const PIPES_AND_COMPONENTS = [BackButtonDirective];

@NgModule({
  imports: [CommonModule],
  declarations: PIPES_AND_COMPONENTS,
  exports: PIPES_AND_COMPONENTS
})
export class DirectivesModule {}
