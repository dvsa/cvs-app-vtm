import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionComponent } from '@app/shared/libraries/accordion/accordion.component';
import { AccordionItemComponent } from '@app/shared/libraries/accordion-item/accordion-item.component';

export const COMPONENTS = [
  AccordionComponent,
  AccordionItemComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class LibrariesModule {}
