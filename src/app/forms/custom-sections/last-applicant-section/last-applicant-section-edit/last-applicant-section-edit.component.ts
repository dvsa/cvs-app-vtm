import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';

@Component({
	selector: 'app-last-applicant-section-edit',
	templateUrl: './last-applicant-section-edit.component.html',
	styleUrls: ['./last-applicant-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupInputComponent],
})
export class LastApplicantSectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy {
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControls(this.defaultFields, this.form);

		// Attach all form controls to parent
		this.init(this.form);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
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
