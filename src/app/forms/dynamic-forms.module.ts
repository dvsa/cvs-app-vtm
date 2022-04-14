import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';

@NgModule({
  declarations: [BaseControlComponent, TextInputComponent, DynamicFormGroupComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [TextInputComponent, DynamicFormGroupComponent]
})
export class DynamicFormsModule {}
