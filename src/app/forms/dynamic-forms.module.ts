import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TruncatePipe } from '@shared/pipes/truncate/truncate.pipe';
import { SharedModule } from '@shared/shared.module';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { DateComponent } from './components/date/date.component';
import { FocusNextDirective } from './components/date/focus-next.directive';
import { DefectSelectComponent } from './components/defect-select/defect-select.component';
import { DefectComponent } from './custom-sections/defect/defect.component';
import { DefectsComponent } from './custom-sections/defects/defects.component';
import { DynamicFormFieldComponent } from './components/dynamic-form-field/dynamic-form-field.component';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';
import { FieldErrorMessageComponent } from './components/field-error-message/field-error-message.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { ReadOnlyComponent } from './components/read-only/read-only.component';
import { SelectComponent } from './components/select/select.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ViewCombinationComponent } from './components/view-combination/view-combination.component';
import { ViewListItemComponent } from './components/view-list-item/view-list-item.component';
import { NumberOnlyDirective } from './directives/app-number-only.directive';
import { WeightsComponent } from './custom-sections/weights/weights.component';
import { DimensionsComponent } from './custom-sections/dimensions/dimensions.component';
import { BrakesComponent } from './custom-sections/brakes/brakes.component';
import { SwitchableInputComponent } from './components/switchable-input/switchable-input.component';
import { SuffixDirective } from './directives/suffix.directive';
import { AbandonDialogComponent } from './custom-sections/abandon-dialog/abandon-dialog.component';

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
    DefectSelectComponent,
    FocusNextDirective,
    TruncatePipe,
    WeightsComponent,
    DimensionsComponent,
    BrakesComponent,
    SwitchableInputComponent,
    ReadOnlyComponent,
    SuffixDirective,
    AbandonDialogComponent
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
    DefectSelectComponent,
    WeightsComponent,
    DimensionsComponent,
    BrakesComponent,
    SwitchableInputComponent,
    SuffixDirective,
    ReadOnlyComponent,
    AbandonDialogComponent
  ]
})
export class DynamicFormsModule {}
