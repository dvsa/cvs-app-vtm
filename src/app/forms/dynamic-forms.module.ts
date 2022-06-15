import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { DefectComponent } from './components/defect/defect.component';
import { DefectsComponent } from './components/defects/defects.component';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ViewCombinationComponent } from './components/view-combination/view-combination.component';
import { ViewListItemComponent } from './components/view-list-item/view-list-item.component';
import { DynamicFormFieldComponent } from './components/dynamic-form-field/dynamic-form-field.component';

@NgModule({
  declarations: [BaseControlComponent, TextInputComponent, ViewListItemComponent, DynamicFormGroupComponent, ViewCombinationComponent, CheckboxGroupComponent, RadioGroupComponent, DefectComponent, DefectsComponent, AutocompleteComponent, DynamicFormFieldComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, RouterModule],
  exports: [TextInputComponent, ViewListItemComponent, DynamicFormGroupComponent, ViewCombinationComponent, CheckboxGroupComponent, RadioGroupComponent, DefectComponent, DefectsComponent, AutocompleteComponent, DynamicFormFieldComponent]
})
export class DynamicFormsModule {}
