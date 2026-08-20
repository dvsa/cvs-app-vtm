import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukFormGroupDateComponent } from '@/src/app/forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { Modes } from '@models/modes.enum';
import { TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';

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
	],
	styleUrls: ['./test.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit, OnDestroy {
	store = inject(Store);
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);

	mode = input.required<Modes>();
	initialMode = input.required<Modes>();

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	destroy = new ReplaySubject<boolean>(1);

	startTimeDisplay = new FormControl({ value: '', disabled: true });
	endTimeDisplay = new FormControl({ value: '', disabled: true });

	readonly FormNodeWidth = FormNodeWidth;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	readonly REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	ngOnInit(): void {
		this.addValidators();
		this.disableFields();
		this.handleTestStartTimestampChange();
		this.handleTestEndTimestampChange();
		this.initTimeDisplayControls();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
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

		testTypeGroup.controls.testExpiryDate.setValidators([
			this.commonValidators.applyWhen(() => this.mode() === Modes.AMEND, this.commonValidators.required('Expiry Date')),
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
			this.commonValidators.applyWhen(() => this.shouldShowLoadStatus(), this.commonValidators.required('Load status')),
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

	shouldShowCentralDocs(): boolean {
		return TEST_TYPES_GROUP9_10_CENTRAL_DOCS.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	shouldShowLoadStatus(): boolean {
		const testType = this.testResult()?.testTypes?.[0];
		if (!testType) return false;

		// Applicable for HGV/TRL annual tests, or full prohibition tests
		const loadStatusTestIds = ['94', '40', '70', '107'];
		if (loadStatusTestIds.includes(testType.testTypeId)) return true;

		// Also applicable for HGV/TRL annual test retests
		const loadStatusRetestIds = ['53', '98'];
		if (!loadStatusRetestIds.includes(testType.testTypeId)) return false;

		if (testType.testResult !== TestResults.FAIL) return false;
		if (!Array.isArray(testType.defects)) return false;

		return testType.defects.some((defect) => {
			return [59, 71, 72, 73].includes(defect.imNumber);
		});
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

	protected readonly Modes = Modes;
	protected readonly FORM_NODE_WIDTH = FormNodeWidth;
	protected readonly UNLADEN_BODY_TYPES = UnladenBodyType;
	protected readonly REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	protected readonly VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
}
