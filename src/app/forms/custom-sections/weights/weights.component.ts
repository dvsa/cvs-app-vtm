import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectTechRecord } from '@/src/app/store/technical-records';
import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { CommonValidatorsService } from '../../validators/common-validators.service';

@Component({
	selector: 'app-weights',
	templateUrl: './weights.component.html',
	styleUrls: ['./weights.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupInputComponent],
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
				this.commonValidators.min(1, 'Design gross vehicle weight'),
				this.commonValidators.max(999999, 'Design gross vehicle weight'),
			]),
			designGrossTrainWeight: this.fb.control<number | null | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.min(1, 'Design gross train weight'),
				this.commonValidators.max(999999, 'Design gross train weight'),
			]),
			designGrossAxleWeight: this.fb.control<number | null | undefined>({ value: undefined, disabled: false }, [
				this.commonValidators.min(1, 'Design total axle weight'),
				this.commonValidators.max(999999, 'Design total axle weight'),
			]),
		}),
	});

	techRecord = this.store.selectSignal(selectTechRecord);
	destroy = new ReplaySubject<boolean>(1);
	VehicleTypes = VehicleTypes;
	FormNodeWidth = FormNodeWidth;

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
		const techRecord = this.techRecord();
		if (!techRecord) return;

		const isContingencyTest = this.isContingencyTest();
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
			} else if (isContingencyTest) {
				designGrossVehicleWeight.addValidators(this.commonValidators.required('Design gross vehicle weight'));
			}
		}

		// If the tech record has a train design weight, pre-populate the form and disable the field, otherwise require manual input (in create mode)
		if (techRecord.techRecord_vehicleType === VehicleTypes.HGV) {
			const dgtw = techRecord.techRecord_trainDesignWeight;
			if (dgtw != null && dgtw !== 0) {
				designGrossTrainWeight.patchValue(dgtw);
				designGrossTrainWeight.disable();
			} else if (isContingencyTest) {
				designGrossTrainWeight.addValidators(this.commonValidators.required('Design gross train weight'));
			}
		}

		// If the tech record has a total axle weight, pre-populate the form and disable the field, otherwise require manual input (in create mode)
		if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) {
			const dtaw = this.techRecordService.getDesignTotalAxleWeight(techRecord);
			if (dtaw != null && dtaw !== 0) {
				designGrossAxleWeight.patchValue(dtaw);
				designGrossAxleWeight.disable();
			} else if (isContingencyTest) {
				designGrossAxleWeight.addValidators(this.commonValidators.required('Design total axle weight'));
			}
		}
	}
}
