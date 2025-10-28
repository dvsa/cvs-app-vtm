import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-authorisation-into-service',
	templateUrl: './authorisation-into-service.component.html',
	styleUrls: ['./authorisation-into-service.component.scss'],
	imports: [ReactiveFormsModule, GovukFormGroupDateComponent],
})
export class AuthorisationIntoServiceComponent extends EditBaseComponent implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<TechRecordType<'trl'>>();

	form = this.fb.group<Partial<Record<keyof TechRecordType<'trl'>, FormControl>>>({
		techRecord_authIntoService_cocIssueDate: this.fb.control<string | null>(null, [
			this.commonValidators.pastDate('COC issue date must be in the past'),
			this.commonValidators.date('COC issue date'),
		]),
		techRecord_authIntoService_dateReceived: this.fb.control<string | null>(null, [
			this.commonValidators.pastDate('Date received must be in the past'),
			this.commonValidators.date('Date received'),
		]),
		techRecord_authIntoService_datePending: this.fb.control<string | null>(null, [
			this.commonValidators.date('Date pending'),
		]),
		techRecord_authIntoService_dateAuthorised: this.fb.control<string | null>(null, [
			this.commonValidators.pastDate('Date authorised must be in the past'),
			this.commonValidators.date('Date authorised'),
		]),
		techRecord_authIntoService_dateRejected: this.fb.control<string | null>(null, [
			this.commonValidators.pastDate('Date rejected must be in the past'),
			this.commonValidators.date('Date rejected'),
		]),
	});

	ngOnInit(): void {
		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
