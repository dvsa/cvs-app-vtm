import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectTechRecord } from '@/src/app/store/technical-records';
import { testResultInEdit, toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { type DesignTrainWeightRequired, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GovukFormGroupCheckboxComponent } from '../../components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { CommonValidatorsService } from '../../validators/common-validators.service';

@Component({
	selector: 'app-weights',
	templateUrl: './weights.component.html',
	styleUrls: ['./weights.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupInputComponent, GovukFormGroupCheckboxComponent],
})
export class WeightsComponent implements OnInit, OnDestroy {
	store = inject(Store);
	fb = inject(FormBuilder);
	techRecordService = inject(TechnicalRecordService);
	commonValidators = inject(CommonValidatorsService);

	edit = input(false);
	isContingencyTest = input(true);
	data = input<Partial<TestResultSchema>>({});
	formChange = output<Record<string, any> | [][]>();

	form = this.fb.group({
		weights: this.fb.group({
			designGrossVehicleWeight: this.fb.control<number | null>(null, [
				this.commonValidators.min(1, 'Design gross vehicle weight', 'kg'),
				this.commonValidators.max(99999, 'Design gross vehicle weight', 'kg'),
			]),
			designGrossTrainWeight: this.fb.control<number | null | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.min(1, 'Design gross train weight', 'kg'),
				this.commonValidators.max(99999, 'Design gross train weight', 'kg'),
			]),
			designGrossAxleWeight: this.fb.control<number | null | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.min(1, 'Design total axle weight', 'kg'),
				this.commonValidators.max(99999, 'Design total axle weight', 'kg'),
			]),
			designTrainWeightRequired: this.fb.control<DesignTrainWeightRequired | undefined>({
				value: undefined,
				disabled: false,
			}),
		}),
	});

	techRecord = this.store.selectSignal(selectTechRecord);
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	editingTestResult = this.store.selectSignal(testResultInEdit);
	destroy = new ReplaySubject<boolean>(1);
	VehicleTypes = VehicleTypes;
	FormNodeWidth = FormNodeWidth;

	// @TODO: replace with enum when exposed as a .js file in the type definitions package
	NOT_APPLICABLE = 'N/A' as DesignTrainWeightRequired.NOT_APPLICABLE;

	ngOnInit(): void {
		this.handleFormChange();
		this.initForm();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	handleFormChange(): void {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => this.formChange.emit(this.form.getRawValue()));
	}

	initForm(): void {
		if (!this.edit()) return;

		const isContingencyTest = this.isContingencyTest();
		isContingencyTest ? this.initContingencyTestForm() : this.initAmendTestForm();
	}

	initAmendTestForm(): void {
		const testResult = this.testResult();
		if (!testResult) return;

		this.form.patchValue({ weights: testResult.weights });
	}

	initContingencyTestForm(): void {
		const techRecord = this.techRecord();
		if (!techRecord) return;

		this.form.patchValue({ weights: this.editingTestResult()?.weights });

		const designGrossVehicleWeight = this.form.controls.weights.controls.designGrossVehicleWeight;
		const designGrossTrainWeight = this.form.controls.weights.controls.designGrossTrainWeight;
		const designGrossAxleWeight = this.form.controls.weights.controls.designGrossAxleWeight;

		// If the tech record has a gross design weight, pre-populate the form and disable the field, otherwise require manual input (in create mode)
		if (
			techRecord.techRecord_vehicleType === VehicleTypes.HGV ||
			techRecord.techRecord_vehicleType === VehicleTypes.TRL
		) {
			const dgvw = techRecord.techRecord_grossDesignWeight;
			if (dgvw != null && dgvw !== 0) {
				designGrossVehicleWeight.patchValue(dgvw);
				designGrossVehicleWeight.disable();
			}
			designGrossVehicleWeight.addValidators(this.commonValidators.required('Design gross vehicle weight'));
		}

		// If the tech record has a train design weight, pre-populate the form and disable the field, otherwise require manual input (in create mode)
		if (techRecord.techRecord_vehicleType === VehicleTypes.HGV) {
			const dgtw = techRecord.techRecord_trainDesignWeight;
			if (dgtw != null && dgtw !== 0) {
				designGrossTrainWeight.patchValue(dgtw);
				designGrossTrainWeight.disable();
			}
			designGrossTrainWeight.addValidators(
				this.commonValidators.applyWhen(
					() => this.form.controls.weights.controls.designTrainWeightRequired.getRawValue() !== this.NOT_APPLICABLE,
					this.commonValidators.required('Design gross train weight')
				)
			);
		}

		// If the tech record has a total axle weight, pre-populate the form and disable the field, otherwise require manual input (in create mode)
		if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) {
			const dtaw = this.techRecordService.getDesignTotalAxleWeight(techRecord);
			if (dtaw != null && dtaw !== 0) {
				designGrossAxleWeight.patchValue(dtaw);
				designGrossAxleWeight.disable();
			}
			designGrossAxleWeight.addValidators(this.commonValidators.required('Design total axle weight'));
		}
	}

	handleTrainWeightNotApplicable(value: unknown): void {
		if (typeof value !== 'boolean') return;

		const dgtw = this.form.controls.weights.controls.designGrossTrainWeight;
		const dtwr = this.form.controls.weights.controls.designTrainWeightRequired;
		if (value) {
			dtwr.patchValue(this.NOT_APPLICABLE);
			dgtw.patchValue(null); // clear design gross train weight
		} else {
			dtwr.patchValue(undefined);
		}
	}
}
