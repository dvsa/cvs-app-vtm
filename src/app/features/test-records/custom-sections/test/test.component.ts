import { InputComponent } from '@/src/app/components/input/input.component';
import { SelectComponent } from '@/src/app/components/select/select.component';
import { TextareaComponent } from '@/src/app/components/textarea/textarea.component';
import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions, PASS_FAIL_OPTIONS, RESULT_OPTIONS, YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { LoadStatusService } from '@/src/app/services/load-status/load-status.service';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectAllReferenceDataByResourceType } from '@/src/app/store/reference-data';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	linkedSignal,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	apply,
	applyEach,
	disabled,
	form,
	FormField,
	hidden,
	maxLength,
	minLength,
	pattern,
	required,
} from '@angular/forms/signals';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { DocumentType } from '@models/document-type.enum';
import { Modes } from '@models/modes.enum';
import { TEST_TYPES_GROUP7, TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GenerateAdrCertificateComponent } from './generate-adr-certificate/generate-adr-certificate.component';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [
		DatePipe,
		FormsModule,
		ReactiveFormsModule,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		GovukFormGroupRadioComponent,
		GovukFormGroupDateComponent,
		DefaultNullOrEmpty,
		RadioComponent,
		GovukCheckboxGroupComponent,
		FormField,
		InputComponent,
		TextareaComponent,
		SelectComponent,
		GenerateAdrCertificateComponent,
	],
	styleUrls: ['./test.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit, OnDestroy {
	store = inject(Store);
	testService = inject(TestService);
	testTypeService = inject(TestTypeService);
	techRecordService = inject(TechnicalRecordService);
	optionsService = inject(MultiOptionsService);
	commonValidators = inject(CommonValidatorsService);
	loadStatusService = inject(LoadStatusService);
	actions$ = inject(Actions);

	mode = input.required<Modes>();
	initialMode = input.required<Modes>();

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	techRecord = this.store.selectSignal(techRecord);
	abandonReasons = computed(() => this.getAbandonReasonsList());
	destroy = new ReplaySubject<boolean>(1);

	readonly FormNodeWidth = FormNodeWidth;
	readonly TestResults = TestResults;
	readonly ABANDON_REASONS_REGEX = new RegExp('\\. (?<!\\..\\. )');
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	readonly draft = linkedSignal({
		source: this.testResult,
		computation: (testResult) => ({
			contingencyTestNumber: testResult?.contingencyTestNumber || '',
			testTypes: [
				{
					testCode: testResult?.testTypes?.[0]?.testCode || '',
					testNumber: testResult?.testTypes?.[0]?.testNumber || '',
					testResult: testResult?.testTypes?.[0]?.testResult ?? null,
					description: testResult?.testTypes?.[0]?.testTypeName || '',
					certificateNumber: testResult?.testTypes?.[0]?.certificateNumber || '',
					testTypeStartTimestamp: testResult?.testTypes?.[0]?.testTypeStartTimestamp || '',
					testTypeEndTimestamp: testResult?.testTypes?.[0]?.testTypeEndTimestamp || '',
					centralDocs: testResult?.testTypes?.[0]?.centralDocs || {
						issueRequired: false,
						notes: ' ',
						reasonsForIssue: [],
					},
					loadStatus: {
						vehicleLoadStatus: testResult?.testTypes?.[0]?.loadStatus?.vehicleLoadStatus || null,
						unladenBodyType: testResult?.testTypes?.[0]?.loadStatus?.unladenBodyType || null,
						otherUnladenBodyType: testResult?.testTypes?.[0]?.loadStatus?.otherUnladenBodyType || '',
						reasonForNotLoading: testResult?.testTypes?.[0]?.loadStatus?.reasonForNotLoading || null,
						partiallyLadenReason: testResult?.testTypes?.[0]?.loadStatus?.partiallyLadenReason || '',
						otherReasonForNotLoading: testResult?.testTypes?.[0]?.loadStatus?.otherReasonForNotLoading || '',
					},
					reasonForAbandoning: testResult?.testTypes?.[0]?.reasonForAbandoning || '',
					additionalCommentsForAbandon: testResult?.testTypes?.[0]?.additionalCommentsForAbandon || '',
				},
			],
		}),
	});
	readonly testResultForm = form(this.draft, (schema) => {
		// Contingency Test Number
		apply(schema.contingencyTestNumber, (contingencyTestNumber) => {
			hidden(contingencyTestNumber, {
				when: () => this.initialMode() !== Modes.EDIT,
			});
			required(contingencyTestNumber, {
				message: 'Contingency Test Number is required',
				when: () => this.initialMode() === Modes.EDIT,
			});
			minLength(contingencyTestNumber, 6, {
				message: 'Contingency Test Number must be at least 6 characters long',
			});
			maxLength(contingencyTestNumber, 8, {
				message: 'Contingency Test Number must be at most 8 characters long',
			});
		});

		// Test types
		applyEach(schema.testTypes, (testType) => {
			// Test code
			apply(testType.testCode, (testCode) => {
				disabled(testCode, { when: () => this.initialMode() === Modes.AMEND });
			});
			// Description
			apply(testType, (description) => {
				hidden(description, { when: () => !(this.isTestTypeGroup7() && this.mode() === Modes.EDIT) });
				disabled(description);
			});
			// Test number
			apply(testType.testNumber, (testNumber) => {
				hidden(testNumber, { when: () => this.initialMode() !== Modes.AMEND });
				disabled(testNumber, { when: () => this.initialMode() === Modes.AMEND });
			});
			// Certificate number
			apply(testType.certificateNumber, (certificateNumber) => {
				hidden(certificateNumber, {
					when: (ctx) => {
						if (this.isTestTypeGroup7()) {
							return (
								ctx.valueOf(testType.testResult) !== TestResults.PASS ||
								ctx.valueOf(testType.centralDocs.issueRequired) === true
							);
						}
						return true;
					},
				});
				required(certificateNumber, {
					message: 'Certificate number is required is required with Result',
					when: (ctx) => ctx.valueOf(testType.testResult) === null,
				});
				pattern(certificateNumber, /^[a-zA-Z0-9]+$/, {
					message: 'Certificate number must be alphanumeric',
				});
			});
			// Test start date and time
			apply(testType.testTypeStartTimestamp, (testTypeStartTimestamp) => {
				disabled(testTypeStartTimestamp, { when: () => this.initialMode() === Modes.AMEND });
			});
			// Test end date and time
			apply(testType.testTypeEndTimestamp, (testTypeEndTimestamp) => {
				disabled(testTypeEndTimestamp, { when: () => this.initialMode() === Modes.AMEND });
			});
			// Load status
			apply(testType.loadStatus, (loadStatus) => {
				hidden(loadStatus, { when: () => this.loadStatusService.isLoadStatusApplicable(this.testResult()) });
				// Unladen body type
				apply(loadStatus.unladenBodyType, (unladenBodyType) => {
					hidden(unladenBodyType, {
						when: (ctx) => ctx.valueOf(loadStatus.vehicleLoadStatus) !== VehicleLoadStatusType.UNLADEN,
					});
					required(unladenBodyType, {
						message: 'Body type is required',
					});
				});
				// Other unladen body type
				apply(loadStatus.otherUnladenBodyType, (otherUnladenBodyType) => {
					hidden(otherUnladenBodyType, {
						when: (ctx) => ctx.valueOf(loadStatus.otherReasonForNotLoading) === UnladenBodyType.OTHER,
					});
					required(otherUnladenBodyType, {
						message: 'Enter body type',
					});
				});
				// Reason for not loading
				apply(loadStatus.reasonForNotLoading, (reasonForNotLoading) => {
					hidden(reasonForNotLoading, {
						when: (ctx) => ctx.valueOf(loadStatus.vehicleLoadStatus) !== VehicleLoadStatusType.UNLADEN,
					});
					required(reasonForNotLoading, {
						message: 'Reason for not loading is required',
					});
				});
				// Other reason for not loading
				apply(loadStatus.otherReasonForNotLoading, (otherReasonForNotLoading) => {
					hidden(otherReasonForNotLoading, {
						when: (ctx) => ctx.valueOf(loadStatus.reasonForNotLoading) !== ReasonForNotLoading.OTHER,
					});
					required(otherReasonForNotLoading, {
						message: 'Enter reason for not loading',
					});
				});
				// Partially laden reason
				apply(loadStatus.partiallyLadenReason, (partiallyLadenReason) => {
					hidden(partiallyLadenReason, {
						when: (ctx) => ctx.valueOf(loadStatus.vehicleLoadStatus) !== VehicleLoadStatusType.PARTIALLY_LADEN,
					});
					required(partiallyLadenReason, {
						message: 'Enter partially laden reason',
					});
					maxLength(partiallyLadenReason, 200, {
						message: 'Partially laden reason must be less than or equal to 200 characters',
					});
				});
			});
			// Additional comments for abandoning
			apply(testType.additionalCommentsForAbandon, (additionalCommentsForAbandon) => {
				hidden(additionalCommentsForAbandon, {
					when: (ctx) => ctx.valueOf(testType.testResult) !== TestResults.ABANDONED,
				});
				required(additionalCommentsForAbandon, {
					message: 'Additional details for abandoning is required with Result',
				});
				maxLength(additionalCommentsForAbandon, 500, {
					message: 'Additional comments for abandoning must be less than or equal to 500 characters',
				});
			});
		});
	});

	constructor() {
		// This syncs state
		// @TODO: remove once everything is migrated to signal forms
		effect(() => {
			this.form.patchValue(this.draft());
		});
	}

	ngOnInit(): void {
		this.prepopulateVTG15Required();
		this.loadOptions();
		this.addValidators();
		this.disableFields();
		this.handleTestStartTimestampChange();
		this.handleTestEndTimestampChange();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	prepopulateVTG15Required(): void {
		if (this.initialMode() !== Modes.EDIT && this.initialMode() !== Modes.CREATE) return;

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
		return referenceData.map((reason) => ({ label: `${reason.description}`, value: `${reason.description}` }));
	}

	loadOptions(): void {
		const testResult = this.testResult();
		if (!testResult) return;
		this.optionsService.loadOptions(this.testTypeService.getAbandonReasonsResourceType(testResult));
	}

	addValidators(): void {
		const testTypeGroup = this.form.controls.testTypes.at(0);

		testTypeGroup.controls.prohibitionIssued.setValidators([
			this.commonValidators.applyWhen(
				() => this.shouldShowProhibitionIssued(),
				this.commonValidators.required('Prohibition Issued')
			),
		]);

		testTypeGroup.controls.testExpiryDate.setValidators([
			this.commonValidators.applyWhen(
				() =>
					(this.mode() === Modes.AMEND && testTypeGroup.controls.testResult.value === TestResults.PASS) ||
					this.shouldShowExpiryDate(),
				this.commonValidators.required('Expiry Date')
			),
			this.commonValidators.date('Expiry Date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Expiry Date', 'Start Time'),
			this.commonValidators.applyWhen(
				() => this.isTestTypeGroup7() && this.mode() === Modes.EDIT,
				this.commonValidators.futureDate('Expiry Date')
			),
		]);

		testTypeGroup.controls.testAnniversaryDate.setValidators([
			this.commonValidators.applyWhen(
				() => this.mode() === Modes.AMEND && testTypeGroup.controls.testResult.value === TestResults.PASS,
				this.commonValidators.required('Anniversary date')
			),
			this.commonValidators.date('Anniversary date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Anniversary date', 'Start Time'),
		]);

		testTypeGroup.controls.testTypeStartTimestamp.setValidators([
			this.commonValidators.required('Test start date and time'),
			this.commonValidators.datetime({ label: 'Test start date and time' }),
			this.commonValidators.pastDate('Test start date and time'),
		]);

		testTypeGroup.controls.testTypeEndTimestamp.setValidators([
			this.commonValidators.required('Test end date and time'),
			this.commonValidators.datetime({ label: 'Test end date and time' }),
			this.commonValidators.pastDate('Test end date and time'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Test end date and time', 'Test start date and time'),
		]);

		const loadStatusGroup = testTypeGroup.controls.loadStatus;
		loadStatusGroup.controls.vehicleLoadStatus.setValidators([
			this.commonValidators.applyWhen(() => this.isLoadStatusRequired(), this.commonValidators.required('Load status')),
		]);
	}

	disableFields(): void {
		// Initially enable all controls
		this.form.enable();

		if (this.initialMode() === Modes.AMEND) {
			this.form.controls.testTypes.at(0).controls.createdAt.disable();
		}
	}

	getResultOptions() {
		if (this.mode() === Modes.AMEND) {
			return RESULT_OPTIONS;
		}
		return PASS_FAIL_OPTIONS;
	}

	handleTestStartTimestampChange(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.testTypeStartTimestamp.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe((value) => {
				// Hoist value to top level of form
				this.form.patchValue({ testStartTimestamp: value || undefined });
			});
	}

	handleTestEndTimestampChange(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.testTypeEndTimestamp.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe((value) => {
				// Hoist value to top level of form
				this.form.patchValue({ testEndTimestamp: value || undefined });
			});
	}

	isTestTypeGroup7(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	shouldShowResult(): boolean {
		return this.isTestTypeGroup7();
	}

	shouldShowExpiryDate(): boolean {
		const isGroup7 = TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
		if (this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED) return false;
		if (this.mode() === Modes.ABANDON) return false;
		if (!isGroup7) return false;
		if (this.testResult()?.testTypes[0].testResult === 'fail') return false;
		return true;
	}

	shouldShowAnniversaryDate(): boolean {
		return !this.isTestTypeGroup7();
	}

	shouldShowCentralDocs(): boolean {
		return (
			[...TEST_TYPES_GROUP9_10_CENTRAL_DOCS, ...TEST_TYPES_GROUP7].includes(
				this.testResult()?.testTypes[0].testTypeId ?? ''
			) && this.testResult()?.testTypes[0].testResult !== 'fail'
		);
	}

	shouldShowGenerateADRCertificate(): boolean {
		if (this.mode() === Modes.AMEND) {
			return false;
		}
		return (
			TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '') &&
			this.testResult()?.testTypes[0].testResult === 'pass'
		);
	}

	shouldShowProhibitionIssued(): boolean {
		return this.isTestTypeGroup7();
	}

	shouldShowLoadStatus(): boolean {
		return this.loadStatusService.isLoadStatusApplicable(this.testResult());
	}

	isLoadStatusRequired(): boolean {
		// When amending a test, load status is displayed but can be left blank
		return this.shouldShowLoadStatus() && this.initialMode() !== Modes.AMEND;
	}

	isUnladenSelected(): boolean {
		const vehicleLoadStatus = this.form.get('testTypes.0.loadStatus.vehicleLoadStatus')?.getRawValue();
		return vehicleLoadStatus === VehicleLoadStatusType.UNLADEN;
	}

	isPartiallyLadenSelected(): boolean {
		const vehicleLoadStatus = this.form.get('testTypes.0.loadStatus.vehicleLoadStatus')?.getRawValue();
		return vehicleLoadStatus === VehicleLoadStatusType.PARTIALLY_LADEN;
	}

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
