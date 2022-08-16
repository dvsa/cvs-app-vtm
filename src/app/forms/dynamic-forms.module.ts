import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { SharedModule } from '@shared/shared.module';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { DateComponent } from './components/date/date.component';
import { DefectComponent } from './components/defect/defect.component';
import { DefectsComponent } from './components/defects/defects.component';
import { DynamicFormFieldComponent } from './components/dynamic-form-field/dynamic-form-field.component';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';
import { FieldErrorMessageComponent } from './components/field-error-message/field-error-message.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { SelectComponent } from './components/select/select.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { VehicleHeaderComponent } from './components/vehicle-header/vehicle-header.component';
import { ViewCombinationComponent } from './components/view-combination/view-combination.component';
import { ViewListItemComponent } from './components/view-list-item/view-list-item.component';
import { NumberOnlyDirective } from './directives/app-number-only.directive';
import { TestTypeSelectComponent } from './components/test-type-select/test-type-select.component';
import { TestTypeNamePipe } from './components/test-type-select/test-type-name.pipe';

@NgModule({
  declarations: [
    BaseControlComponent,
    TextInputComponent,
    ViewListItemComponent,
    DynamicFormGroupComponent,
    ViewCombinationComponent,
    CheckboxGroupComponent,
    RadioGroupComponent,
    DefectComponent,
    DefectsComponent,
    AutocompleteComponent,
    NumberInputComponent,
    TextAreaComponent,
    NumberOnlyDirective,
    DateComponent,
    SelectComponent,
    DynamicFormFieldComponent,
    FieldErrorMessageComponent,
    TestTypeSelectComponent,
    TestTypeNamePipe,
    VehicleHeaderComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, RouterModule],
  exports: [
    TextInputComponent,
    ViewListItemComponent,
    DynamicFormGroupComponent,
    ViewCombinationComponent,
    CheckboxGroupComponent,
    RadioGroupComponent,
    DefectComponent,
    DefectsComponent,
    AutocompleteComponent,
    NumberInputComponent,
    TextAreaComponent,
    DateComponent,
    SelectComponent,
    DynamicFormFieldComponent,
    FieldErrorMessageComponent,
    TestTypeSelectComponent,
    VehicleHeaderComponent
  ]
})
export class DynamicFormsModule {}
