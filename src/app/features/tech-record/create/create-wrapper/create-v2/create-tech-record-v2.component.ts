import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { Component, OnChanges, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
  CheckboxGroupComponent,
  CheckboxGroupComponent as CheckboxGroupComponent_1,
} from '@forms/components/checkbox-group/checkbox-group.component';
import { TextInputComponent } from '@forms/components/text-input/text-input.component';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { MultiOptions } from '@models/options.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { StatusCodes, V3TechRecordModel, VehicleTypes, VehiclesOtherThan } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { setSpinnerState } from '@store/spinner/spinner.actions';
import { firstValueFrom } from 'rxjs';
import {
  GovukFormGroupCheckboxComponent
} from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import {
  GovukFormGroupInputComponent
} from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';

@Component({
	selector: 'app-create-tech-record-v2',
	templateUrl: './create-tech-record-v2.component.html',
	styleUrls: ['./create-tech-record-v2.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonGroupComponent,
    ButtonComponent,
    ReactiveFormsModule,
    NoSpaceDirective,
    ToUppercaseDirective,
    TrimWhitespaceDirective,
    GovukFormGroupCheckboxComponent,
    GovukFormGroupInputComponent,
  ],
})
export class CreateTechRecordV2Component implements OnChanges {
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);
	batchTechRecordService = inject(BatchTechnicalRecordService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store);
  fb = inject(FormBuilder);
  commonValidatorService = inject(CommonValidatorsService);

	techRecord: Partial<V3TechRecordModel> = {};
	vinUnique = false;
	vrmUnique = false;
	trlUnique = false;
	isVinUniqueCheckComplete = false;
	isDuplicateVinAllowed = false;

  form2 = this.fb.group({
    vrmTrm: this.fb.control<string>('', [
      this.commonValidatorService.pattern('^[0-9]{7}[zZ]$', 'The VRM/Trailer ID cannot be in a format that is 7 digits followed by the character \'Z\''),
      this.commonValidatorService.alphanumeric('VRM/Trailer ID must be alphanumeric'),
      this.commonValidatorService.required('VRM/Trailer ID is required'),
      // TODO add vrm/trm length validators when the vehicle type field component is implemented
    ])

  })
	form = new CustomFormGroup(
		{ name: 'main-form', type: FormNodeTypes.GROUP },
		{
			vrmTrm: new CustomFormControl(
				{ name: 'input-vrm-or-trailer-id', label: 'VRM/TRM', type: FormNodeTypes.CONTROL },
				'',
				[
					CustomValidators.alphanumeric(),
					CustomValidators.notZNumber,
					CustomValidators.validateVRMTrailerIdLength('vehicleType'),
					Validators.required,
				]
			),
			// vehicleStatus: new CustomFormControl(
			// 	{ name: 'change-vehicle-status-select', label: 'Vehicle status', type: FormNodeTypes.CONTROL },
			// 	StatusCodes.PROVISIONAL,
			// 	[Validators.required]
			// ),
			// vehicleType: new CustomFormControl(
			// 	{ name: 'change-vehicle-type-select', label: 'Vehicle type', type: FormNodeTypes.CONTROL },
			// 	'',
			// 	[Validators.required]
			// ),
			generateID: new CustomFormControl({ name: 'generate-c-or-z-num', type: FormNodeTypes.CONTROL }, false),
		}
	);

	constructor() {
		this.batchTechRecordService.clearBatch();
		this.technicalRecordService.clearSectionTemplateStates();
	}

	toggleVrmInput(checked: CheckboxGroupComponent) {
		const { vrmTrm } = this.form.controls;

		if (checked.value) {
			vrmTrm.removeValidators(Validators.required);
			vrmTrm.setValue(null);
			vrmTrm.disable();
		} else {
			vrmTrm.addValidators(Validators.required);
			vrmTrm.setValue('');
			vrmTrm.enable();
		}
	}

	get isFormValid(): boolean {
		const errors: GlobalError[] = [];

		DynamicFormService.validate(this.form, errors);

		this.globalErrorService.setErrors(errors);

		return this.form.valid;
	}

	ngOnChanges(): void {
		this.isVinUniqueCheckComplete = false;
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	async handleSubmit() {
		if (!this.isFormValid) {
			return;
		}

		this.store.dispatch(setSpinnerState({ showSpinner: true }));

		const formValueUnique = await this.isFormValueUnique();

		this.store.dispatch(setSpinnerState({ showSpinner: false }));

		if (!formValueUnique) {
			this.isDuplicateVinAllowed = true;
			return;
		}

		this.technicalRecordService.updateEditingTechRecord(this.techRecord as TechRecordType<'put'>);
		this.technicalRecordService.generateEditingVehicleTechnicalRecordFromVehicleType(
			this.techRecord.techRecord_vehicleType as VehicleTypes
		);
		this.technicalRecordService.clearSectionTemplateStates();
		await this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
	}

	async isFormValueUnique() {
		const isTrailer = this.form.value.vehicleType === VehicleTypes.TRL;

		this.techRecord.techRecord_vehicleType = this.form.value.vehicleType;
		this.techRecord.techRecord_statusCode = this.form.value.vehicleStatus;

		// if (!this.isVinUniqueCheckComplete) {
		// 	this.vinUnique = await this.isVinUnique();
		// }
    //
		// if (this.form.controls['generateID'].value) {
		// 	return this.vinUnique || this.isDuplicateVinAllowed;
		// }

		if (isTrailer) {
			this.trlUnique = await this.isTrailerIdUnique();

      // TODO remove below line and uncomment line beneath when required
      return this.trlUnique;
			// return (this.vinUnique || this.isDuplicateVinAllowed) && this.trlUnique;
		}
		this.vrmUnique = await this.isVrmUnique();
    // TODO remove below line and uncomment line beneath when required
    return this.vrmUnique;
		// return (this.vinUnique || this.isDuplicateVinAllowed) && this.vrmUnique;
	}

	// async isVinUnique(): Promise<boolean> {
	// 	this.techRecord.vin = this.form.value.vin;
	// 	const isVinUnique = await firstValueFrom(
	// 		this.technicalRecordService.isUnique(this.techRecord.vin as string, SEARCH_TYPES.VIN)
	// 	);
	// 	this.isVinUniqueCheckComplete = true;
	// 	return isVinUnique;
	// }

	async isVrmUnique() {
		(this.techRecord as VehiclesOtherThan<'trl'>).primaryVrm = this.form.value.vrmTrm;
		const isVrmUnique = await firstValueFrom(
			this.technicalRecordService.isUnique(
				(this.techRecord as VehiclesOtherThan<'trl'>).primaryVrm?.replace(/\s+/g, '') ?? '',
				SEARCH_TYPES.VRM
			)
		);
		if (!isVrmUnique) {
			this.globalErrorService.addError({ error: 'Vrm not unique', anchorLink: 'input-vrm-or-trailer-id' });
		}
		return isVrmUnique;
	}

	async isTrailerIdUnique() {
		if (this.techRecord.techRecord_vehicleType === 'trl') {
			this.techRecord.trailerId = this.form.value.vrmTrm;
			const isTrailerIdUnique = await firstValueFrom(
				this.technicalRecordService.isUnique(this.techRecord.trailerId as string, SEARCH_TYPES.TRAILER_ID)
			);
			if (!isTrailerIdUnique) {
				this.globalErrorService.addError({ error: 'Trailer ID must be unique', anchorLink: 'input-vrm-or-trailer-id' });
			}
			return isTrailerIdUnique;
		}
		return false;
	}
}
