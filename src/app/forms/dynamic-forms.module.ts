import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';
import { ListItemOutputComponent } from './components/list-item-output/list-item-output.component';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  declarations: [BaseControlComponent, TextInputComponent, ListItemOutputComponent, DynamicFormGroupComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [TextInputComponent, ListItemOutputComponent, DynamicFormGroupComponent]
})
export class DynamicFormsModule {}
