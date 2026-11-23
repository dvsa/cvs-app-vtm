import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import {
	MultiOptions,
	PASS_FAIL_OPTIONS,
	PASS_FAIL_PRS_OPTIONS,
	RESULT_OPTIONS,
	YES_NO_OPTIONS,
} from '@/src/app/models/options.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectAllReferenceDataByResourceType } from '@/src/app/store/reference-data';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import {
	AbstractControl,
	FormArray,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	ValidationErrors,
} from '@angular/forms';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { ApprovalMediaDownloadComponent } from '@components/approval-media-download/approval-media-download.component';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { DocumentType } from '@models/document-type.enum';
import { Modes } from '@models/modes.enum';
import {
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP7,
	TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
	TEST_TYPES_GROUP12_14,
} from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { GenerateAdrCertificateComponent } from './generate-adr-certificate/generate-adr-certificate.component';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [
		DatePipe,
		NgTemplateOutlet,
		FormsModule,
		ReactiveFormsModule,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
		DefaultNullOrEmpty,
		GovukFormGroupSelectComponent,
		GovukFormGroupTextareaComponent,
		RadioComponent,
		GovukCheckboxGroupComponent,
		ApprovalMediaDownloadComponent,
		GenerateAdrCertificateComponent,
	],
	styleUrls: ['./test.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {
	store = inject(Store);
	testService = inject(TestService);
	testTypeService = inject(TestTypeService);
	techRecordService = inject(TechnicalRecordService);
	optionsService = inject(MultiOptionsService);
	commonValidators = inject(CommonValidatorsService);

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	techRecord = this.store.selectSignal(techRecord);
	abandonReasons = computed(() => this.getAbandonReasonsList());

	readonly FormNodeWidth = FormNodeWidth;
	readonly TestResults = TestResults;
	readonly ABANDON_REASONS_REGEX = new RegExp('\\. (?<!\\..\\. )');
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);
	readonly resultOptions = computed(() => {
		if (this.testService.mode() === Modes.AMEND) {
			return RESULT_OPTIONS;
		}
		if (this.isSpecialistGroup1()) {
			return PASS_FAIL_PRS_OPTIONS;
		}
		return PASS_FAIL_OPTIONS;
	});

	ngOnInit(): void {
		this.prepopulateVTG15Required();
		this.loadOptions();
		this.addValidators();
		this.disableFields();
	}

	prepopulateVTG15Required(): void {
		if (this.testService.initialMode() !== Modes.EDIT && this.testService.initialMode() !== Modes.CREATE) return;

		const vtg15Required = this.form.controls.vtg15.controls.vtg15Required;
		if (vtg15Required.value != null) return;

		const techRecord = this.techRecord();
		if (
			techRecord?.techRecord_vehicleType === 'hgv' ||
			techRecord?.techRecord_vehicleType === 'lgv' ||
			techRecord?.techRecord_vehicleType === 'trl'
		) {
			vtg15Required.setValue(techRecord.techRecord_adrDetails_dangerousGoods ? null : false);
		}
	}

	getAbandonReasonsList(): MultiOptions {
		const testResult = this.testResult();
		if (!testResult) return [];

		const resourceType = this.testTypeService.getAbandonReasonsResourceType(testResult);
		const referenceData = this.store.selectSignal(selectAllReferenceDataByResourceType(resourceType))() || [];
		return referenceData.map((reason) => ({
			label: `${reason.description}`,
			value: `${reason.description}`,
		}));
	}

	loadOptions(): void {
		const testResult = this.testResult();
		if (!testResult) return;
		this.optionsService.loadOptions(this.testTypeService.getAbandonReasonsResourceType(testResult));
	}

	addValidators(): void {
		const testTypeGroup = this.form.controls.testTypes.at(0);

		testTypeGroup.controls.testResult.setValidators([
			// Applies when abandoning too, as it does in the dynamic form flow
			this.commonValidators.applyWhen(
				() => this.isSpecialistGroup1(),
				(control) => this.validateResultAgainstRequiredStandards(control)
			),
		]);

		testTypeGroup.controls.prohibitionIssued.setValidators([
			this.commonValidators.applyWhen(
				() => this.shouldShowProhibitionIssued(),
				this.commonValidators.required('Prohibition issued')
			),
		]);

		testTypeGroup.controls.testExpiryDate.setValidators([
			this.commonValidators.applyWhen(
				() =>
					(this.testService.mode() === Modes.AMEND &&
						testTypeGroup.controls.testResult.value === TestResults.PASS &&
						!this.isSpecialistGroup1() &&
						!this.isTestTypeGroup12or14() &&
						!this.isTestTypeGroup5or13()) ||
					this.shouldShowExpiryDate(),
				this.commonValidators.required('Expiry Date')
			),
			this.commonValidators.date('Expiry Date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Expiry Date', 'Start Time'),
			this.commonValidators.applyWhen(
				() => this.isTestTypeGroup7() && this.testService.mode() === Modes.EDIT,
				this.commonValidators.futureDate('Expiry Date')
			),
		]);

		testTypeGroup.controls.testAnniversaryDate.setValidators([
			this.commonValidators.applyWhen(
				() =>
					this.testService.mode() === Modes.AMEND &&
					testTypeGroup.controls.testResult.value === TestResults.PASS &&
					this.shouldShowAnniversaryDate(),
				this.commonValidators.required('Anniversary date')
			),
			this.commonValidators.date('Anniversary date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Anniversary date', 'Start Time'),
		]);

		testTypeGroup.controls.reasonForAbandoning.setValidators([
			this.commonValidators.applyWhen(
				() => this.isTestTypeGroup5or13() && this.isAbandoned(),
				this.commonValidators.required('Reason for abandoning')
			),
		]);

		testTypeGroup.controls.reapplicationDate.setValidators([
			this.commonValidators.applyWhen(
				() => this.shouldShowReapplicationDate(),
				this.commonValidators.required('Reapplication date'),
				this.commonValidators.date('Reapplication date'),
				this.commonValidators.futureDate('Reapplication date')
			),
		]);

		testTypeGroup.controls.additionalCommentsForAbandon.setValidators([
			this.commonValidators.applyWhen(
				() =>
					this.testService.mode() === Modes.AMEND &&
					this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED,
				this.commonValidators.requiredWith('Additional details for abandoning', 'Result', 'test')
			),
		]);
	}

	disableFields(): void {
		Object.values(this.form.controls).forEach((control) => {
			this.enableReactiveControls(control);
		});
		this.form.updateValueAndValidity();
	}

	private containsSignalControl(control: AbstractControl): boolean {
		if (control instanceof SignalFormControl) return true;
		if (control instanceof FormGroup || control instanceof FormArray) {
			return Object.values(control.controls).some((child) => this.containsSignalControl(child));
		}
		return false;
	}

	private enableReactiveControls(control: AbstractControl): void {
		if (control instanceof SignalFormControl) return;
		if ((control instanceof FormGroup || control instanceof FormArray) && this.containsSignalControl(control)) {
			// Enabling a container directly would also enable its signal descendants.
			Object.values(control.controls).forEach((child) => this.enableReactiveControls(child));
			control.updateValueAndValidity({ onlySelf: true });
		} else {
			control.enable({ onlySelf: true });
		}
	}

	readonly isTestTypeGroup7 = computed(() =>
		TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
	);

	readonly isSpecialistGroup1 = computed(() =>
		TEST_TYPES_GROUP1_SPEC_TEST.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
	);

	readonly isTestTypeGroup12or14 = computed(() =>
		TEST_TYPES_GROUP12_14.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
	);

	readonly isTestTypeGroup5or13 = computed(() =>
		TEST_TYPES_GROUP5_13.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
	);

	readonly isAbandoned = computed(() => this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED);

	readonly isPassOrPrs = computed(() => {
		const testResult = this.testResult()?.testTypes[0].testResult;
		return testResult === TestResults.PASS || testResult === TestResults.PRS;
	});

	readonly shouldShowResult = computed(
		() => this.isTestTypeGroup7() || this.isSpecialistGroup1() || this.isTestTypeGroup5or13()
	);

	/** Mirrors the `resultDependantOnRequiredStandards` async validator used by the dynamic form service. */
	validateResultAgainstRequiredStandards(control: AbstractControl): ValidationErrors | null {
		const hasRequiredStandards = !!this.form.controls.testTypes.at(0).controls.requiredStandards.value?.length;

		if (control.value === TestResults.PASS && hasRequiredStandards) {
			return {
				invalidTestResult: {
					error: 'Cannot pass test when required standards are present',
				},
			};
		}
		if (control.value === TestResults.FAIL && !hasRequiredStandards) {
			return {
				invalidTestResult: {
					error: 'Cannot fail test when no required standards are present',
				},
			};
		}
		if (control.value === TestResults.PRS && !hasRequiredStandards) {
			return {
				invalidTestResult: {
					error: 'Cannot mark test as PRS when no required standards are present',
				},
			};
		}

		return null;
	}

	readonly shouldShowExpiryDate = computed(() => {
		if (this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED) return false;
		if (this.testService.mode() === Modes.ABANDON) return false;
		if (!this.isTestTypeGroup7()) return false;
		if (this.testResult()?.testTypes[0].testResult === 'fail') return false;
		return true;
	});

	readonly shouldShowCreateModeDescription = computed(
		() =>
			(this.isTestTypeGroup7() || this.isTestTypeGroup5or13() || this.isSpecialistGroup1()) &&
			this.testService.mode() === Modes.EDIT
	);

	readonly shouldShowAnniversaryDate = computed(
		() =>
			!this.isTestTypeGroup7() &&
			!this.isSpecialistGroup1() &&
			!this.isTestTypeGroup12or14() &&
			!this.isTestTypeGroup5or13()
	);

	readonly shouldShowCentralDocs = computed(() => {
		if (this.isSpecialistGroup1() || this.isTestTypeGroup5or13()) {
			return this.isPassOrPrs();
		}

		return (
			[...TEST_TYPES_GROUP9_10_CENTRAL_DOCS, ...TEST_TYPES_GROUP7].includes(
				this.testResult()?.testTypes[0].testTypeId ?? ''
			) && this.testResult()?.testTypes[0].testResult !== 'fail'
		);
	});

	readonly shouldShowGenerateADRCertificate = computed(() => {
		if (this.testService.mode() === Modes.AMEND) {
			return false;
		}
		return (
			TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '') &&
			this.testResult()?.testTypes[0].testResult === 'pass'
		);
	});

	readonly shouldShowProhibitionIssued = computed(
		() => this.isTestTypeGroup7() || this.isSpecialistGroup1() || this.isTestTypeGroup5or13()
	);

	readonly shouldShowReapplicationDate = computed(
		() => this.isSpecialistGroup1() && this.testResult()?.testTypes[0].testResult === TestResults.FAIL
	);

	readonly shouldShowApprovalsMedia = computed(
		() =>
			this.isSpecialistGroup1() &&
			(this.testService.mode() === Modes.VIEW ||
				(this.testService.initialMode() === Modes.AMEND && this.testService.mode() === Modes.SUMMARY))
	);

	readonly shouldShowLoadStatus = this.testService.showLoadStatus;
	readonly isLoadStatusRequired = this.testService.loadStatusRequired;

	getReasonsList(reasons: string | string[] | null): string[] {
		return Array.isArray(reasons) ? reasons : (reasons?.split(this.ABANDON_REASONS_REGEX) ?? []);
	}

	protected readonly Modes = Modes;
	protected readonly FORM_NODE_WIDTH = FormNodeWidth;
	protected readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	protected readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	protected readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	protected readonly getOptionsFromEnum = getOptionsFromEnum;
	protected readonly PASS_FAIL_OPTIONS = PASS_FAIL_OPTIONS;
	protected readonly DocumentType = DocumentType;
}
