import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-manufacturer',
	templateUrl: './manufacturer.component.html',
	styleUrls: ['./manufacturer.component.scss'],
	imports: [GovukFormGroupTextareaComponent, ReactiveFormsModule, GovukFormGroupInputComponent],
})
export class ManufacturerComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<TechRecordType<'trl'>>();

	form = this.fb.group({
		techRecord_manufacturerDetails_name: this.fb.control(null, [
			this.commonValidators.maxLength(150, 'Name or company must be less than or equal to 150 characters'),
		]),
		techRecord_manufacturerDetails_address1: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Address line 1 must be less than or equal to 60 characters'),
		]),
		techRecord_manufacturerDetails_address2: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Address line 2 must be less than or equal to 60 characters'),
		]),
		techRecord_manufacturerDetails_postTown: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Town or city must be less than or equal to 60 characters'),
		]),
		techRecord_manufacturerDetails_address3: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'County must be less than or equal to 60 characters'),
		]),
		techRecord_manufacturerDetails_postCode: this.fb.control(null, [
			this.commonValidators.maxLength(12, 'Postcode must be less than or equal to 12 characters'),
		]),
		techRecord_manufacturerDetails_telephoneNumber: this.fb.control(null, [
			this.commonValidators.maxLength(25, 'Telephone number must be less than or equal to 25 characters'),
		]),
		techRecord_manufacturerDetails_emailAddress: this.fb.control(null, [
			this.commonValidators.maxLength(255, 'Email address must be less than or equal to 255 characters'),
			this.commonValidators.pattern(
				"^[\\w\\-\\.\\+']+@([\\w-]+\\.)+[\\w-]{2,}$",
				'Enter an email address in the correct format, like name@example.com'
			),
		]),
		techRecord_manufacturerDetails_faxNumber: this.fb.control(null, [
			this.commonValidators.maxLength(25, 'Fax number must be less than or equal to 25 characters'),
		]),
		techRecord_manufacturerDetails_manufacturerNotes: this.fb.control(null, [
			this.commonValidators.maxLength(1024, 'Manufacturer notes must be less than or equal to 1024 characters'),
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
