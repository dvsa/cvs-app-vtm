import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions, PASS_FAIL_OPTIONS, YES_NO_OPTIONS } from '@/src/app/models/options.model';
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
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@components/button/button.component';
import { RetrieveDocumentDirective } from '@directives/retrieve-document/retrieve-document.directive';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import {
	TechRecordGETHGV,
	TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { DocumentType } from '@models/document-type.enum';
import { Modes } from '@models/modes.enum';
import { TEST_TYPES_GROUP7, TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { retryInterceptorFailure } from '@store/retry-interceptor/retry-interceptor.actions';
import { generateADRCertificate, generateADRCertificateSuccess } from '@store/technical-records';
import { ReplaySubject, take, takeUntil } from 'rxjs';

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
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
		DefaultNullOrEmpty,
		GovukFormGroupSelectComponent,
		GovukFormGroupTextareaComponent,
		RadioComponent,
		GovukCheckboxGroupComponent,
		ButtonComponent,
		FieldErrorMessageComponent,
		RetrieveDocumentDirective,
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
	systemNumber?: string;
	createdTimestamp?: string;

	startTimeDisplay = new FormControl({ value: '', disabled: true });
	endTimeDisplay = new FormControl({ value: '', disabled: true });

	readonly FormNodeWidth = FormNodeWidth;
	readonly TestResults = TestResults;
	readonly ABANDON_REASONS_REGEX = new RegExp('\\. (?<!\\..\\. )');
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);
	readonly adrCertificateFileName = signal<string | undefined>(undefined);
	readonly adrCertificateError = signal<string | null | undefined>(undefined);

	ngOnInit(): void {
		this.prepopulateVTG15Required();
		this.loadOptions();
		this.addValidators();
		this.disableFields();
		this.handleTestStartTimestampChange();
		this.handleTestEndTimestampChange();
		this.initTimeDisplayControls();

		this.techRecordService.techRecord$.pipe(takeUntil(this.destroy)).subscribe((record) => {
			this.systemNumber = (record as TechRecordGETHGV).systemNumber;
			this.createdTimestamp = (record as TechRecordGETHGV).createdTimestamp;
		});

		this.actions$.pipe(ofType(generateADRCertificateSuccess), takeUntil(this.destroy)).subscribe(({ id }) => {
			this.adrCertificateFileName.set(id);
		});

		this.actions$.pipe(ofType(retryInterceptorFailure), takeUntil(this.destroy)).subscribe(() => {
			this.adrCertificateError.set(
				'Try link again or Enter 000000 in Certificate Number and then press "Pass And Issue Documents Centrally" on TAS'
			);
		});
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

		this.form.controls.contingencyTestNumber.setValidators([
			this.commonValidators.applyWhen(
				() => this.contingencyTestNumberIsRequired(),
				this.commonValidators.required('Contingency Test Number')
			),
			this.commonValidators.minLength(6, 'Contingency Test Number'),
			this.commonValidators.maxLength(8, 'Contingency Test Number'),
		]);

		testTypeGroup.controls.certificateNumber.setValidators([
			this.commonValidators.applyWhen(
				() => this.shouldShowCertificateNumber(),
				this.commonValidators.required('Certificate Number')
			),
			this.commonValidators.alphanumeric('Certificate Number'),
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
		loadStatusGroup.controls.unladenBodyType.setValidators([
			this.commonValidators.applyWhen(() => this.isUnladenSelected(), this.commonValidators.required('Body type')),
		]);
		loadStatusGroup.controls.otherUnladenBodyType.setValidators([
			this.commonValidators.applyWhen(
				() => this.isOtherUnladenBodyTypeRequired(),
				this.commonValidators.required('Enter body type'),
				this.commonValidators.maxLength(200, 'Enter body type')
			),
		]);
		loadStatusGroup.controls.reasonForNotLoading.setValidators([
			this.commonValidators.applyWhen(
				() => this.isUnladenSelected(),
				this.commonValidators.required('Reason for not loading')
			),
		]);
		loadStatusGroup.controls.partiallyLadenReason.setValidators([
			this.commonValidators.applyWhen(
				() => this.isPartiallyLadenSelected(),
				this.commonValidators.required('Partially laden reason'),
				this.commonValidators.maxLength(200, 'Partially laden reason')
			),
		]);
		loadStatusGroup.controls.otherReasonForNotLoading.setValidators([
			this.commonValidators.applyWhen(
				() => this.isOtherReasonForNotLoadingRequired(),
				this.commonValidators.required('Enter reason for not loading'),
				this.commonValidators.maxLength(200, 'Enter reason for not loading')
			),
		]);
	}

	disableFields(): void {
		// Initially enable all controls
		this.form.enable();

		if (this.initialMode() === Modes.AMEND) {
			this.form.controls.testTypes.at(0).controls.createdAt.disable();
			this.form.controls.testTypes.at(0).controls.testCode.disable();
			this.form.controls.testTypes.at(0).controls.testTypeName.disable();
			this.form.controls.testTypes.at(0).controls.testNumber.disable();
			this.form.controls.testTypes.at(0).controls.testTypeEndTimestamp.disable();
			this.form.controls.testTypes.at(0).controls.testTypeStartTimestamp.disable();
		}

		if (TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '')) {
			this.form.controls.testTypes.at(0).controls.testTypeName.disable();
		}
	}

	contingencyTestNumberIsRequired(): boolean {
		return this.initialMode() === Modes.EDIT;
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

	shouldShowResult(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	shouldShowExpiryDate(): boolean {
		const isGroup7 = TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
		if (!isGroup7) return false;
		if (this.testResult()?.testTypes[0].testResult === 'fail') return false;
		return true;
	}

	shouldShowDescription(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	shouldShowCentralDocs(): boolean {
		return [...TEST_TYPES_GROUP9_10_CENTRAL_DOCS, ...TEST_TYPES_GROUP7].includes(
			this.testResult()?.testTypes[0].testTypeId ?? ''
		);
	}

	shouldShowGenerateADRCertificate(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	shouldShowCertificateNumber(): boolean {
		const group7 = TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
		if (!group7) return false;
		if (this.testResult()?.testTypes[0].testResult == 'fail') {
			return false;
		}
		return !(
			this.testResult()?.testTypes[0].testResult == 'pass' && this.testResult()?.testTypes[0].centralDocs?.issueRequired
		);
	}

	shouldShowProhibitionIssued(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
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

	isOtherUnladenBodyTypeRequired(): boolean {
		if (!this.isUnladenSelected()) return false;

		const unladenBodyType = this.form.get('testTypes.0.loadStatus.unladenBodyType')?.getRawValue();
		return unladenBodyType === UnladenBodyType.OTHER;
	}

	isOtherReasonForNotLoadingRequired(): boolean {
		if (!this.isUnladenSelected()) return false;

		const reasonForNotLoading = this.form.get('testTypes.0.loadStatus.reasonForNotLoading')?.getRawValue();
		return reasonForNotLoading === ReasonForNotLoading.OTHER;
	}

	private formatDateTimeLocal(isoString: string | null | undefined): string {
		if (!isoString) return '';
		const date = new Date(isoString);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const ms = date.getMilliseconds().toString().padStart(3, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
	}

	private initTimeDisplayControls(): void {
		if (this.initialMode() !== Modes.AMEND) return;

		const testTypeGroup = this.form.controls.testTypes.at(0);

		this.startTimeDisplay.setValue(this.formatDateTimeLocal(testTypeGroup.controls.testTypeStartTimestamp.value));
		this.endTimeDisplay.setValue(this.formatDateTimeLocal(testTypeGroup.controls.testTypeEndTimestamp.value));
	}

	getReasonsList(reasons: string | string[] | null): string[] {
		return Array.isArray(reasons) ? reasons : (reasons?.split(this.ABANDON_REASONS_REGEX) ?? []);
	}

	get lastCertificateDate() {
		let sortedTests: ADRCertificateDetails[] | undefined;
		this.techRecordService.techRecord$.pipe(take(1)).subscribe((record) => {
			sortedTests = (record as TechRecordGETHGV | TechRecordGETTRL).techRecord_adrPassCertificateDetails?.sort(
				(a, b) =>
					a.generatedTimestamp && b.generatedTimestamp
						? new Date(b.generatedTimestamp).getTime() - new Date(a.generatedTimestamp).getTime()
						: 0
			);
		});
		return sortedTests && sortedTests?.length > 0
			? `An ADR certificate was last generated on ${new Date(sortedTests[0].generatedTimestamp).toLocaleDateString('en-UK')}`
			: 'There are no previous ADR certificates for this vehicle';
	}

	documentParams(certificate: string): Map<string, string> {
		return new Map([['fileName', certificate]]);
	}

	handleGenerateADRCertificateSubmit(): void {
		this.store.dispatch(
			generateADRCertificate({
				systemNumber: this.systemNumber ?? '',
				createdTimestamp: this.createdTimestamp ?? '',
				certificateType: 'PASS',
			})
		);
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
