import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { RadioGroupComponent } from '@forms/components/radio-group/radio-group.component';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormControl,
	CustomFormGroup,
	FormNodeOption,
	FormNodeTypes,
} from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { editingTechRecord } from '@store/technical-records';
import { take } from 'rxjs';

@Component({
	selector: 'app-select-vehicle-type',
	templateUrl: './select-vehicle-type.component.html',
	imports: [FormsModule, ReactiveFormsModule, RadioGroupComponent, ButtonComponent],
})
export class SelectVehicleTypeComponent {
	globalErrorService = inject(GlobalErrorService);
	batchTechRecordService = inject(BatchTechnicalRecordService);
	trs = inject(TechnicalRecordService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store);

	form: CustomFormGroup = new CustomFormGroup(
		{ name: 'form-group', type: FormNodeTypes.GROUP },
		{
			vehicleType: new CustomFormControl(
				{ name: 'vehicle-type', label: 'Vehicle type', type: FormNodeTypes.CONTROL },
				'',
				[Validators.required]
			),
			tes1Tes2: new CustomFormControl(
				{ name: 'tes1-tes2', label: 'Trailer form type', type: FormNodeTypes.CONTROL },
				'',
				[CustomValidators.requiredIfEquals('vehicleType', [VehicleTypes.TRL])]
			),
		}
	);

	public vehicleTypeOptions: Array<FormNodeOption<string>> = [
		{ label: 'Heavy goods vehicle (HGV)', value: VehicleTypes.HGV },
		{ label: 'Public service vehicle (PSV)', value: VehicleTypes.PSV },
		{ label: 'Trailer (TRL)', value: VehicleTypes.TRL },
	];

	public tes1Tes2Options: Array<FormNodeOption<string>> = [
		{ label: 'TES 1', value: TrailerFormType.TES1 },
		{ label: 'TES 2', value: TrailerFormType.TES2 },
	];

	constructor() {
		this.batchTechRecordService.clearBatch();
		this.trs.clearSectionTemplateStates();
	}

	get isFormValid(): boolean {
		const errors: GlobalError[] = [];

		DynamicFormService.validate(this.form, errors);

		this.globalErrorService.setErrors(errors);

		return this.form.valid;
	}

	cancel() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit(type: VehicleTypes): void {
		if (!this.isFormValid) {
			return;
		}
		if (type === VehicleTypes.PSV) {
			this.batchTechRecordService.setVehicleStatus(StatusCodes.CURRENT);
		} else if (type === VehicleTypes.TRL && this.form.value.tes1Tes2 === TrailerFormType.TES2) {
			this.batchTechRecordService.setVehicleStatus(StatusCodes.PROVISIONAL);
		}

		this.batchTechRecordService.setVehicleType(type);

		this.store
			.select(editingTechRecord)
			.pipe(take(1))
			.subscribe((vehicle) => {
				if (!vehicle) {
					this.trs.updateEditingTechRecord({
						techRecord_reasonForCreation: '',
						techRecord_vehicleType: type,
					} as TechRecordType<'put'>);
				}
			});

		this.trs.generateEditingVehicleTechnicalRecordFromVehicleType(type);

		void this.router.navigate([type], { relativeTo: this.route });
	}
}
