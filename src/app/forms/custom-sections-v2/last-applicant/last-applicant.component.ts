import { Modes } from '@/src/app/models/modes.enum';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastApplicantComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;

	tcs = inject(TechnicalRecordChangesService);

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();
	filters = input<string[]>([]);
	mode = input.required<Modes>();

	form = this.fb.group({
		techRecord_applicantDetails_name: this.fb.control(null, [
			this.commonValidators.maxLength(150, 'Name or company', 'last-applicant', 'techRecord_applicantDetails_name'),
		]),
		techRecord_applicantDetails_address1: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Address line 1', 'last-applicant', 'techRecord_applicantDetails_address1'),
		]),
		techRecord_applicantDetails_address2: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Address line 2', 'last-applicant', 'techRecord_applicantDetails_address2'),
		]),
		techRecord_applicantDetails_postTown: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'Town or city', 'last-applicant', 'techRecord_applicantDetails_postTown'),
		]),
		techRecord_applicantDetails_address3: this.fb.control(null, [
			this.commonValidators.maxLength(60, 'County', 'last-applicant', 'techRecord_applicantDetails_address3'),
		]),
		techRecord_applicantDetails_postCode: this.fb.control(null, [
			this.commonValidators.maxLength(12, 'Postcode', 'last-applicant', 'techRecord_applicantDetails_postCode'),
		]),
		techRecord_applicantDetails_telephoneNumber: this.fb.control(null, [
			this.commonValidators.maxLength(
				25,
				'Telephone number',
				'last-applicant',
				'techRecord_applicantDetails_telephoneNumber'
			),
		]),
		techRecord_applicantDetails_emailAddress: this.fb.control(null, [
			this.commonValidators.maxLength(
				255,
				'Email address',
				'last-applicant',
				'techRecord_applicantDetails_emailAddress'
			),
			this.commonValidators.pattern(
				"^[\\w\\-\\.\\+']+@([\\w-]+\\.)+[\\w-]{2,}$",
				'Enter an email address in the correct format, like name@example.com',
				'last-applicant',
				'techRecord_applicantDetails_emailAddress'
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
		if (!this.form.get(formControlName)) return false;
		return this.mode() === Modes.SUMMARY ? this.tcs.hasChanged(formControlName) : true;
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
