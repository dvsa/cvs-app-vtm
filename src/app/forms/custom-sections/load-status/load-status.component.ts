import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormService } from '@/src/app/services/dynamic-forms/dynamic-form.service';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { selectTechRecord } from '@/src/app/store/technical-records';
import { testResultInEdit, toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
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
	dfs = inject(DynamicFormService);
	commonValidators = inject(CommonValidatorsService);

	edit = input(false);
	isContingencyTest = input(true);
	data = input<Partial<TestResultSchema>>({});
	formChange = output<Record<string, any> | [][]>();

	techRecord = this.store.selectSignal(selectTechRecord);
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	editingTestResult = this.store.selectSignal(testResultInEdit);

	form = this.fb.group({
		loadStatus: this.fb.group({
			vehicleLoadStatus: this.fb.control<VehicleLoadStatusType | null>(null, [
				this.commonValidators.required('Load status'),
			]),
			unladenBodyType: this.fb.control<UnladenBodyType | null>(null, [
				this.commonValidators.applyWhen(() => this.isUnladenSelected(), this.commonValidators.required('Body type')),
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
	});

	FORM_NODE_WIDTH = FormNodeWidth;
	VEHICLE_LOAD_STATUS_TYPES = VehicleLoadStatusType;
	UNLADEN_BODY_TYPES = UnladenBodyType;
	REASONS_FOR_NOT_LOADING = ReasonForNotLoading;
	UNLADEN_BODY_TYPES_OPTIONS = getOptionsFromEnum(UnladenBodyType);
	REASON_FOR_NOT_LOADING_OPTIONS = getOptionsFromEnum(ReasonForNotLoading);

	destroy = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.handleFormChange();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	handleFormChange(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			this.formChange.emit(this.form.getRawValue());
			console.log(this.form.getRawValue());
		});
	}

	isUnladenSelected(): boolean {
		const vehicleLoadStatus = this.form.get('loadStatus.vehicleLoadStatus')?.getRawValue();
		return vehicleLoadStatus === VehicleLoadStatusType.UNLADEN;
	}

	isPartiallyLadenSelected(): boolean {
		const vehicleLoadStatus = this.form.get('loadStatus.vehicleLoadStatus')?.getRawValue();
		return vehicleLoadStatus === VehicleLoadStatusType.PARTIALLY_LADEN;
	}

	isOtherUnladenBodyTypeRequired(): boolean {
		if (!this.isUnladenSelected()) return false;

		const unladenBodyType = this.form.get('loadStatus.unladenBodyType')?.getRawValue();
		return unladenBodyType === UnladenBodyType.OTHER;
	}

	isOtherReasonForNotLoadingRequired(): boolean {
		if (!this.isUnladenSelected()) return false;

		const reasonForNotLoading = this.form.get('loadStatus.reasonForNotLoading')?.getRawValue();
		return reasonForNotLoading === ReasonForNotLoading.OTHER;
	}
}
