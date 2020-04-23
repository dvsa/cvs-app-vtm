import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackButtonDirective } from '@app/shared/directives/back-button.directive';
import { DigitOnlyDirective } from '@app/shared/directives/digit-only.directive';

export const PIPES_AND_COMPONENTS = [BackButtonDirective, DigitOnlyDirective];

@NgModule({
  imports: [CommonModule],
  declarations: PIPES_AND_COMPONENTS,
  exports: PIPES_AND_COMPONENTS
})
export class DirectivesModule {}
