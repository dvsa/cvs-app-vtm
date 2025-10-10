import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-last-applicant',
	templateUrl: './last-applicant.component.html',
	styleUrls: ['./last-applicant.component.scss'],
	imports: [ReactiveFormsModule, GovukFormGroupInputComponent],
})
export class LastApplicantComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	form = this.fb.group({
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
			this.commonValidators.maxLength(60, 'Town or city must be less than or equal to 60 characters'),
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
				'Enter an email address in the correct format, like name@example.com'
			),
		]),
	});

	ngOnInit(): void {
		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
