import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { ApprovalTypeFocusNextDirective } from '@directives/approval-type-focus-next/approval-type-focus-next.directive';
import { DateFocusNextDirective } from '@directives/date-focus-next/date-focus-next.directive';
import { PrefixDirective } from '@directives/prefix/prefix.directive';
import { SuffixDirective } from '@directives/suffix/suffix.directive';
import { ApprovalTypeInputComponent } from '@forms/components/approval-type/approval-type.component';
import { AdrCertificateHistoryComponent } from '@forms/custom-sections/adr-certificate-history/adr-certificate-history.component';
import { AdrExaminerNotesHistoryEditComponent } from '@forms/custom-sections/adr-examiner-notes-history-edit/adr-examiner-notes-history.component-edit';
import { AdrPermittedDangerousGoodsComponent } from '@forms/custom-sections/adr-permitted-dangerous-goods/adr-permitted-dangerous-goods.component';
import { ApprovalTypeComponent } from '@forms/custom-sections/approval-type/approval-type.component';
import { SharedModule } from '@shared/shared.module';
import { TruncatePipe } from '../pipes/truncate/truncate.pipe';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { BaseControlComponent } from './components/base-control/base-control.component';
import { CharacterCountComponent } from './components/character-count/character-count.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ContingencyAdrGenerateCertComponent } from './components/contingency-adr-generate-cert/contingency-adr-generate-cert.component';
import { ControlErrorsComponent } from './components/control-errors/control-errors.component';
import { DateControlsComponent } from './components/date-controls/date-controls.component';
import { DateComponent } from './components/date/date.component';
import { DefectSelectComponent } from './components/defect-select/defect-select.component';
import { DynamicFormFieldComponent } from './components/dynamic-form-field/dynamic-form-field.component';
import { DynamicFormGroupComponent } from './components/dynamic-form-group/dynamic-form-group.component';
import { FieldErrorMessageComponent } from './components/field-error-message/field-error-message.component';
import { FieldWarningMessageComponent } from './components/field-warning-message/field-warning-message.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { ReadOnlyComponent } from './components/read-only/read-only.component';
import { RequiredStandardSelectComponent } from './components/required-standard-select/required-standard-select.component';
import { SelectComponent } from './components/select/select.component';
import { SuggestiveInputComponent } from './components/suggestive-input/suggestive-input.component';
import { SwitchableInputComponent } from './components/switchable-input/switchable-input.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ViewCombinationComponent } from './components/view-combination/view-combination.component';
import { ViewListItemComponent } from './components/view-list-item/view-list-item.component';
import { AbandonDialogComponent } from './custom-sections/abandon-dialog/abandon-dialog.component';
import { AdrExaminerNotesHistoryViewComponent } from './custom-sections/adr-examiner-notes-history-view/adr-examiner-notes-history-view.component';
import { AdrNewCertificateRequiredViewComponent } from './custom-sections/adr-new-certificate-required-view/adr-new-certificate-required-view.component';
import { AdrSectionEditComponent } from './custom-sections/adr-section/adr-section-edit/adr-section-edit.component';
import { AdrSectionSummaryComponent } from './custom-sections/adr-section/adr-section-summary/adr-section-summary.component';
import { AdrSectionViewComponent } from './custom-sections/adr-section/adr-section-view/adr-section-view.component';
import { AdrSectionComponent } from './custom-sections/adr-section/adr-section.component';
import { AdrTankDetailsInitialInspectionViewComponent } from './custom-sections/adr-tank-details-initial-inspection-view/adr-tank-details-initial-inspection-view.component';
import { AdrTankDetailsM145ViewComponent } from './custom-sections/adr-tank-details-m145-view/adr-tank-details-m145-view.component';
import { AdrTankDetailsSubsequentInspectionsEditComponent } from './custom-sections/adr-tank-details-subsequent-inspections-edit/adr-tank-details-subsequent-inspections-edit.component';
import { AdrTankDetailsSubsequentInspectionsViewComponent } from './custom-sections/adr-tank-details-subsequent-inspections-view/adr-tank-details-subsequent-inspections-view.component';
import { AdrTankStatementUnNumberEditComponent } from './custom-sections/adr-tank-statement-un-number-edit/adr-tank-statement-un-number-edit.component';
import { AdrTankStatementUnNumberViewComponent } from './custom-sections/adr-tank-statement-un-number-view/adr-tank-statement-un-number-view.component';
import { AdrComponent } from './custom-sections/adr/adr.component';
import { BodyComponent } from './custom-sections/body/body.component';
import { CustomDefectComponent } from './custom-sections/custom-defect/custom-defect.component';
import { CustomDefectsComponent } from './custom-sections/custom-defects/custom-defects.component';
import { CustomFormControlComponent } from './custom-sections/custom-form-control/custom-form-control.component';
import { DefectComponent } from './custom-sections/defect/defect.component';
import { DefectsComponent } from './custom-sections/defects/defects.component';
import { DimensionsComponent } from './custom-sections/dimensions/dimensions.component';
import { LettersComponent } from './custom-sections/letters/letters.component';
import { ModifiedWeightsComponent } from './custom-sections/modified-weights/modified-weights.component';
import { PlatesComponent } from './custom-sections/plates/plates.component';
import { PsvBrakesComponent } from './custom-sections/psv-brakes/psv-brakes.component';
import { RequiredStandardComponent } from './custom-sections/required-standard/required-standard.component';
import { RequiredStandardsComponent } from './custom-sections/required-standards/required-standards.component';
import { TrlBrakesComponent } from './custom-sections/trl-brakes/trl-brakes.component';
import { TyresComponent } from './custom-sections/tyres/tyres.component';
import { WeightsComponent } from './custom-sections/weights/weights.component';

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
		DateControlsComponent,
		CharacterCountComponent,
		ControlErrorsComponent,
		SelectComponent,
		DynamicFormFieldComponent,
		FieldErrorMessageComponent,
		DefectSelectComponent,
		RequiredStandardSelectComponent,
		DateFocusNextDirective,
		TruncatePipe,
		WeightsComponent,
		LettersComponent,
		PlatesComponent,
		DimensionsComponent,
		TrlBrakesComponent,
		ReadOnlyComponent,
		CustomDefectsComponent,
		RequiredStandardComponent,
		RequiredStandardsComponent,
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
		AdrTankDetailsSubsequentInspectionsEditComponent,
		AdrTankStatementUnNumberEditComponent,
		CustomFormControlComponent,
		AdrExaminerNotesHistoryEditComponent,
		AdrExaminerNotesHistoryViewComponent,
		AdrTankDetailsSubsequentInspectionsViewComponent,
		AdrTankDetailsInitialInspectionViewComponent,
		AdrTankStatementUnNumberViewComponent,
		AdrCertificateHistoryComponent,
		AdrTankDetailsM145ViewComponent,
		ContingencyAdrGenerateCertComponent,
		AdrNewCertificateRequiredViewComponent,
		AdrSectionComponent,
		AdrSectionEditComponent,
		AdrSectionViewComponent,
		AdrSectionSummaryComponent,
		AdrPermittedDangerousGoodsComponent,
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
		DateControlsComponent,
		CharacterCountComponent,
		ControlErrorsComponent,
		SelectComponent,
		DynamicFormFieldComponent,
		FieldErrorMessageComponent,
		DefectSelectComponent,
		RequiredStandardSelectComponent,
		WeightsComponent,
		LettersComponent,
		PlatesComponent,
		TyresComponent,
		DimensionsComponent,
		TrlBrakesComponent,
		ReadOnlyComponent,
		RequiredStandardComponent,
		RequiredStandardsComponent,
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
		AdrCertificateHistoryComponent,
		FieldWarningMessageComponent,
		AdrSectionComponent,
		AdrSectionEditComponent,
		AdrSectionViewComponent,
		AdrSectionSummaryComponent,
	],
})
export class DynamicFormsModule {}
