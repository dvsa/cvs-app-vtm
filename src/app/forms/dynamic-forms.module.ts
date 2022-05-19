import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';
import { ViewListItemComponent } from './components/view-list-item/view-list-item.component';
import { SharedModule } from '@shared/shared.module';
import { ViewCombinationComponent } from './components/view-combination/view-combination.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { TestAmendmentHistoryComponent } from '../features/test-amendment-history/test-amendment-history.component';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [BaseControlComponent, TextInputComponent, ViewListItemComponent, DynamicFormGroupComponent, ViewCombinationComponent, CheckboxGroupComponent, RadioGroupComponent, TestAmendmentHistoryComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [TextInputComponent, ViewListItemComponent, DynamicFormGroupComponent, ViewCombinationComponent, CheckboxGroupComponent, RadioGroupComponent, TestAmendmentHistoryComponent]
})
export class DynamicFormsModule {}
