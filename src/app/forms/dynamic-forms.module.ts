import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApprovalTypeFocusNextDirective } from '@forms/components/approval-type/approval-type-focus-next.directive';
import { ApprovalTypeInputComponent } from '@forms/components/approval-type/approval-type.component';
import { ApprovalTypeComponent } from '@forms/custom-sections/approval-type/approval-type.component';
import { TruncatePipe } from '@shared/pipes/truncate/truncate.pipe';
import { SharedModule } from '@shared/shared.module';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DateComponent } from './components/date/date.component';
import { FocusNextDirective } from './components/date/focus-next.directive';
import { DefectSelectComponent } from './components/defect-select/defect-select.component';
import { DynamicFormFieldComponent } from './components/dynamic-form-field/dynamic-form-field.component';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';
import { FieldErrorMessageComponent } from './components/field-error-message/field-error-message.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { ReadOnlyComponent } from './components/read-only/read-only.component';
import { SelectComponent } from './components/select/select.component';
import { SuggestiveInputComponent } from './components/suggestive-input/suggestive-input.component';
import { SwitchableInputComponent } from './components/switchable-input/switchable-input.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ViewCombinationComponent } from './components/view-combination/view-combination.component';
import { ViewListItemComponent } from './components/view-list-item/view-list-item.component';
import { AbandonDialogComponent } from './custom-sections/abandon-dialog/abandon-dialog.component';
import { BodyComponent } from './custom-sections/body/body.component';
import { CustomDefectComponent } from './custom-sections/custom-defect/custom-defect.component';
import { CustomDefectsComponent } from './custom-sections/custom-defects/custom-defects.component';
import { DefectComponent } from './custom-sections/defect/defect.component';
import { DefectsComponent } from './custom-sections/defects/defects.component';
import { DimensionsComponent } from './custom-sections/dimensions/dimensions.component';
import { LettersComponent } from './custom-sections/letters/letters.component';
import { ModifiedWeightsComponent } from './custom-sections/modified-weights/modified-weights.component';
import { PlatesComponent } from './custom-sections/plates/plates.component';
import { PsvBrakesComponent } from './custom-sections/psv-brakes/psv-brakes.component';
import { TrlBrakesComponent } from './custom-sections/trl-brakes/trl-brakes.component';
import { TyresComponent } from './custom-sections/tyres/tyres.component';
import { WeightsComponent } from './custom-sections/weights/weights.component';
import { NoSpaceDirective } from './directives/app-no-space.directive';
import { NumberOnlyDirective } from './directives/app-number-only.directive';
import { ToUppercaseDirective } from './directives/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from './directives/app-trim-whitespace.directive';
import { PrefixDirective } from './directives/prefix.directive';
import { SuffixDirective } from './directives/suffix.directive';
import { FieldWarningMessageComponent } from './components/field-warning-message/field-warning-message.component';
import { AdrComponent } from './custom-sections/adr/adr.component';
import { NestingLevelDirective } from './directives/nesting-level/nesting-level.directive';

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
    ToUppercaseDirective,
    NoSpaceDirective,
    TrimWhitespaceDirective,
    DateComponent,
    SelectComponent,
    DynamicFormFieldComponent,
    FieldErrorMessageComponent,
    DefectSelectComponent,
    FocusNextDirective,
    TruncatePipe,
    WeightsComponent,
    LettersComponent,
    PlatesComponent,
    DimensionsComponent,
    TrlBrakesComponent,
    ReadOnlyComponent,
    CustomDefectsComponent,
    CustomDefectComponent,
    SwitchableInputComponent,
    ReadOnlyComponent,
    SuffixDirective,
    AbandonDialogComponent,
    BodyComponent,
    TyresComponent,
    PsvBrakesComponent,
    PrefixDirective,
    SuggestiveInputComponent,
    CheckboxComponent,
    ApprovalTypeComponent,
    ApprovalTypeInputComponent,
    ApprovalTypeFocusNextDirective,
    ModifiedWeightsComponent,
    FieldWarningMessageComponent,
    AdrComponent,
    NestingLevelDirective,
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
    LettersComponent,
    PlatesComponent,
    TyresComponent,
    DimensionsComponent,
    TrlBrakesComponent,
    ReadOnlyComponent,
    CustomDefectsComponent,
    CustomDefectComponent,
    SwitchableInputComponent,
    SuffixDirective,
    ReadOnlyComponent,
    AbandonDialogComponent,
    BodyComponent,
    PsvBrakesComponent,
    PrefixDirective,
    SuggestiveInputComponent,
    CheckboxComponent,
    ToUppercaseDirective,
    NoSpaceDirective,
    TrimWhitespaceDirective,
    ApprovalTypeComponent,
    ApprovalTypeInputComponent,
    ApprovalTypeFocusNextDirective,
    ModifiedWeightsComponent,
    AdrComponent,
  ],
})
export class DynamicFormsModule {}
