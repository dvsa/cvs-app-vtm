import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, OnDestroy, OnInit, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '../../components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '../../components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '../../components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '../../components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { getOptionsFromEnum } from '../../utils/enum-map';
import { CommonValidatorsService } from '../../validators/common-validators.service';

@Component({
	selector: 'app-load-status',
	templateUrl: './load-status.component.html',
	styleUrls: ['./load-status.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		RadioComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		DefaultNullOrEmpty,
	],
})
export class LoadStatusComponent implements OnInit, OnDestroy {
	store = inject(Store);
	fb = inject(FormBuilder);
	commonValidators = inject(CommonValidatorsService);

	edit = input(false);
	isContingencyTest = input(true);
	data = input<Partial<TestResultSchema>>({});
	formChange = output<Record<string, any> | [][]>();

	testResult = this.store.selectSignal(toEditOrNotToEdit);
	loadStatusApplicable = false;

	form = this.fb.group({
		testTypes: this.fb.array([
			this.fb.group({
				loadStatus: this.fb.group({
					vehicleLoadStatus: this.fb.control<VehicleLoadStatusType | null>(null, [
						this.commonValidators.applyWhen(
							() => this.loadStatusApplicable && this.isContingencyTest(),
							this.commonValidators.required('Load status')
						),
					]),
					unladenBodyType: this.fb.control<UnladenBodyType | null>(null, [
						this.commonValidators.applyWhen(
							() => this.isUnladenSelected(),
							this.commonValidators.required('Body type')
						),
					]),
					otherUnladenBodyType: this.fb.control<string | null>(null, [
						this.commonValidators.applyWhen(
							() => this.isOtherUnladenBodyTypeRequired(),
							this.commonValidators.maxLength(200, 'Enter body type')
						),
					]),
					reasonForNotLoading: this.fb.control<ReasonForNotLoading | null>(null, [
						this.commonValidators.applyWhen(
							() => this.isUnladenSelected(),
							this.commonValidators.required('Reason for not loading')
						),
					]),
					partiallyLadenReason: this.fb.control<string | null>(null, [
						this.commonValidators.maxLength(200, 'Partially laden reason'),
						this.commonValidators.applyWhen(
							() => this.isPartiallyLadenSelected(),
							this.commonValidators.required('Partially laden reason')
						),
					]),
					otherReasonForNotLoading: this.fb.control<string | null>(null, [
						this.commonValidators.maxLength(200, 'Enter reason for not loading'),
						this.commonValidators.applyWhen(
							() => this.isOtherReasonForNotLoadingRequired(),
							this.commonValidators.required('Enter reason for not loading')
						),
					]),
				}),
			}),
		]),
	});

	FORM_NODE_WIDTH = FormNodeWidth;
	VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	UNLADEN_BODY_TYPES = UnladenBodyType;
	REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	destroy = new ReplaySubject<boolean>(1);

	constructor() {
		effect(() => {
			// Re-compute load status applicability when test type changes in case applicable defects are added
			this.loadStatusApplicable = this.isLoadStatusApplicable();
		});
	}

	ngOnInit(): void {
		this.handleFormChange();
		this.initForm();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	initForm(): void {
		const testResult = this.testResult();
		if (!testResult) return;

		this.form.patchValue(testResult);
	}

	handleFormChange(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			this.formChange.emit(this.form.getRawValue());
		});
	}

	isLoadStatusApplicable(): boolean {
		const testType = this.data()?.testTypes?.[0];
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
}
