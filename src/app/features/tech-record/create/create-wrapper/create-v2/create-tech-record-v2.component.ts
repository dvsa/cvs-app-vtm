import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { TechRecordValidatorsService } from '@/src/app/forms/validators/tech-record-validators.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

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
export class CreateTechRecordV2Component {
	globalErrorService = inject(GlobalErrorService);
	technicalRecordService = inject(TechnicalRecordService);
	batchTechRecordService = inject(BatchTechnicalRecordService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store);
	fb = inject(FormBuilder);
	commonValidatorService = inject(CommonValidatorsService);
	techRecordValidatorService = inject(TechRecordValidatorsService);

	readonly VehicleTypes = VehicleTypes;
	readonly StatusCodes = StatusCodes;

	form = this.fb.group({
		vin: this.fb.nonNullable.control<string>('', []),
		vrmTrm: this.fb.control<string>('', [
			this.commonValidatorService.antipattern(
				'^[0-9]{7}[zZ]$',
				"The VRM/Trailer ID cannot be in a format that is 7 digits followed by the character 'Z'"
			),
			this.commonValidatorService.alphanumeric('VRM/Trailer ID must be alphanumeric'),
			this.commonValidatorService.required('VRM/Trailer ID is required'),
			this.techRecordValidatorService.validateVRMTrailerIdLength('vehicleType'),
		]),
		vehicleStatus: this.fb.nonNullable.control<string>('', [
			this.commonValidatorService.required('Vehicle status is required'),
		]),
		vehicleType: this.fb.nonNullable.control<string>('', [
			this.commonValidatorService.required('Vehicle type is required'),
		]),
		generateID: this.fb.nonNullable.control<boolean>(false, []),
	});

	constructor() {
		this.batchTechRecordService.clearBatch();
		this.technicalRecordService.clearSectionTemplateStates();
	}

	toggleVrmInput(value: boolean) {
		const vrmTrm = this.form.controls.vrmTrm;

		if (value) {
			vrmTrm.removeValidators(this.commonValidatorService.required('VRM/Trailer ID is required'));
			vrmTrm.setValue(null);
			vrmTrm.disable();
		} else {
			vrmTrm.addValidators(this.commonValidatorService.required('VRM/Trailer ID is required'));
			vrmTrm.setValue('');
			vrmTrm.enable();
		}
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit() {
		this.form.markAllAsTouched();

		const errors = this.globalErrorService.extractGlobalErrors(this.form);

		if (errors.length) {
			this.globalErrorService.setErrors(errors);
			return;
		}

		this.globalErrorService.clearErrors();
	}
}
