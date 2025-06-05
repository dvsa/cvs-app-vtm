import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';

@Component({
	selector: 'app-last-applicant-section-edit',
	templateUrl: './last-applicant-section-edit.component.html',
	styleUrls: ['./last-applicant-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupInputComponent],
})
export class LastApplicantSectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControls();

		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control, { emitEvent: false });
			}
		}
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const key of Object.keys(this.form.controls)) {
				parent.removeControl(key, { emitEvent: false });
			}
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	addControls() {
		const vehicleControls = this.defaultFields;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	//TODO replace the email validator with the common microservice
	// once the work has been done to export and import that value on the FE
	get defaultFields() {
		return {
			techRecord_applicantDetails_name: this.fb.control(null, [
				this.commonValidators.maxLength(150, 'Name or company must be less than or equal to 150 characters'),
			]),
			techRecord_applicantDetails_address1: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Address line 1 must be less than or equal to 60 characters'),
			]),
			techRecord_applicantDetails_address2: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Address line 2 must be less than or equal to 60 characters'),
			]),
			techRecord_applicantDetails_postTown: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Town or City must be less than or equal to 60 characters'),
			]),
			techRecord_applicantDetails_address3: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'County must be less than or equal to 60 characters'),
			]),
			techRecord_applicantDetails_postCode: this.fb.control(null, [
				this.commonValidators.maxLength(12, 'Postcode must be less than or equal to 12 characters'),
			]),
			techRecord_applicantDetails_telephoneNumber: this.fb.control(null, [
				this.commonValidators.maxLength(25, 'Telephone number must be less than or equal to 25 characters'),
			]),
			techRecord_applicantDetails_emailAddress: this.fb.control(null, [
				this.commonValidators.maxLength(255, 'Email address must be less than or equal to 255 characters'),
				this.commonValidators.pattern(
					"^[\\w\\-\\.\\+']+@([\\w-]+\\.)+[\\w-]{2,}$",
					'Email address Enter an email address in the correct format, like name@example.com'
				),
			]),
		};
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
}
