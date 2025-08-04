import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { TechRecordValidatorsService } from '@/src/app/forms/validators/tech-record-validators.service';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { setSpinnerState } from '@/src/app/store/spinner/spinner.actions';
import { Component, OnChanges, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { firstValueFrom } from 'rxjs';

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
		GovukFormGroupRadioComponent,
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
	techRecordValidatorService = inject(TechRecordValidatorsService);

	isDuplicateVinAllowed = false;
	isVinUniqueCheckComplete = false;

	vinUnique = false;
	vrmUnique = false;
	trlUnique = false;

	readonly VehicleTypes = VehicleTypes;
	readonly StatusCodes = StatusCodes;

	form = this.fb.group({
		vin: this.fb.nonNullable.control<string>('', [
			this.commonValidatorService.alphanumeric(() => ({
				error: 'Vehicle Identification number (VIN) must be alphanumeric',
				anchorLink: 'input-vin',
			})),
			this.commonValidatorService.pattern('^(?!.*[OIQ]).*$', () => ({
				error: 'Vehicle Identification number (VIN) should not contain O, I or Q',
				anchorLink: 'input-vin',
			})),
			this.commonValidatorService.minLength(3, () => ({
				error: 'Vehicle Identification number (VIN) must be greater or equal to 3 characters',
				anchorLink: 'input-vin',
			})),
			this.commonValidatorService.maxLength(21, () => ({
				error: 'Vehicle Identification number (VIN) must be less than or equal to 21 characters',
				anchorLink: 'input-vin',
			})),
			this.commonValidatorService.required(() => ({
				error: 'Vehicle Identification number (VIN) is required',
				anchorLink: 'input-vin',
			})),
		]),
		vrmTrm: this.fb.control<string>('', [
			this.commonValidatorService.antipattern('^[0-9]{7}[zZ]$', () => ({
				error: "The VRM/Trailer ID cannot be in a format that is 7 digits followed by the character 'Z'",
				anchorLink: 'input-vrm-or-trailer-id',
			})),
			this.commonValidatorService.alphanumeric(() => ({
				error: 'VRM/Trailer ID must be alphanumeric',
				anchorLink: 'input-vrm-or-trailer-id',
			})),
			this.commonValidatorService.required(() => ({
				error: 'VRM/Trailer ID is required',
				anchorLink: 'input-vrm-or-trailer-id',
			})),
			this.techRecordValidatorService.validateVRMTrailerIdLength('vehicleType'),
		]),
		vehicleStatus: this.fb.nonNullable.control<string>('', [
			this.commonValidatorService.required(() => ({
				error: 'Vehicle status is required',
				anchorLink: 'change-vehicle-status-select',
			})),
		]),
		vehicleType: this.fb.nonNullable.control<string>('', [
			this.commonValidatorService.required(() => ({
				error: 'Vehicle type is required',
				anchorLink: 'change-vehicle-type-select',
			})),
		]),
		generateID: this.fb.nonNullable.control<boolean>(false, []),
	});

	constructor() {
		this.batchTechRecordService.clearBatch();
		this.technicalRecordService.clearSectionTemplateStates();
	}

	ngOnChanges(): void {
		this.isVinUniqueCheckComplete = false;
	}

	toggleVrmInput(value: boolean) {
		const vrmTrm = this.form.controls.vrmTrm;

		if (value) {
			vrmTrm.removeValidators(
				this.commonValidatorService.required(() => ({
					error: 'VRM/Trailer ID is required',
					anchorLink: 'input-vrm-or-trailer-id',
				}))
			);
			vrmTrm.setValue(null);
			vrmTrm.disable();
		} else {
			vrmTrm.addValidators(
				this.commonValidatorService.required(() => ({
					error: 'VRM/Trailer ID is required',
					anchorLink: 'input-vrm-or-trailer-id',
				}))
			);
			vrmTrm.setValue('');
			vrmTrm.enable();
		}
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	async handleSubmit() {
		this.form.markAllAsTouched();

		const errors = this.globalErrorService.extractGlobalErrors(this.form);

		if (errors.length) {
			this.globalErrorService.setErrors(errors);
			return;
		}

		this.globalErrorService.clearErrors();

		this.store.dispatch(setSpinnerState({ showSpinner: true }));
		const formValueUnique = await this.isFormValueUnique();
		this.store.dispatch(setSpinnerState({ showSpinner: false }));

		if (!formValueUnique) {
			this.isDuplicateVinAllowed = true;
			return;
		}

		const techRecord = {
			vin: this.form.controls.vin.value,
			techRecord_statusCode: this.form.controls.vehicleStatus.value,
			techRecord_vehicleType: this.form.controls.vehicleType.value,
			trailerId: this.form.controls.vehicleType.value === 'trl' ? this.form.controls.vrmTrm.value : undefined,
			primaryVrm: this.form.controls.vehicleType.value === 'trl' ? undefined : this.form.controls.vrmTrm.value,
		} as unknown as TechRecordType<'put'>;

		this.technicalRecordService.updateEditingTechRecord(techRecord);
		this.technicalRecordService.generateEditingVehicleTechnicalRecordFromVehicleType(
			techRecord.techRecord_vehicleType as VehicleTypes
		);
		this.technicalRecordService.clearSectionTemplateStates();

		await this.router.navigate(['../create/new-record-details'], { relativeTo: this.route });
	}

	async isFormValueUnique() {
		const isTrailer = this.form.value.vehicleType === VehicleTypes.TRL;

		if (!this.isVinUniqueCheckComplete) {
			this.vinUnique = await this.isVinUnique();
		}

		if (this.form.controls['generateID'].value) {
			return this.vinUnique || this.isDuplicateVinAllowed;
		}

		if (isTrailer) {
			this.trlUnique = await this.isTrailerIdUnique();
			return (this.vinUnique || this.isDuplicateVinAllowed) && this.trlUnique;
		}
		this.vrmUnique = await this.isVrmUnique();
		return (this.vinUnique || this.isDuplicateVinAllowed) && this.vrmUnique;
	}

	async isVinUnique(): Promise<boolean> {
		const vin = this.form.controls.vin.value;
		const isVinUnique = await firstValueFrom(this.technicalRecordService.isUnique(vin, SEARCH_TYPES.VIN));
		this.isVinUniqueCheckComplete = true;
		return isVinUnique;
	}

	async isVrmUnique() {
		const vrm = this.form.controls.vrmTrm.value;
		const isVrmUnique = await firstValueFrom(
			this.technicalRecordService.isUnique(vrm?.replace(/\s+/g, '') ?? '', SEARCH_TYPES.VRM)
		);

		if (!isVrmUnique) {
			this.globalErrorService.addError({ error: 'VRM is not unique', anchorLink: 'input-vrm-or-trailer-id' });
		}

		return isVrmUnique;
	}

	async isTrailerIdUnique() {
		const vehicleType = this.form.controls.vehicleType.value;
		if (vehicleType === 'trl') {
			const trailerId = this.form.controls.vrmTrm.value;
			const isTrailerIdUnique = await firstValueFrom(
				this.technicalRecordService.isUnique(trailerId || '', SEARCH_TYPES.TRAILER_ID)
			);

			if (!isTrailerIdUnique) {
				this.globalErrorService.addError({ error: 'Trailer ID must be unique', anchorLink: 'input-vrm-or-trailer-id' });
			}

			return isTrailerIdUnique;
		}

		return false;
	}
}
