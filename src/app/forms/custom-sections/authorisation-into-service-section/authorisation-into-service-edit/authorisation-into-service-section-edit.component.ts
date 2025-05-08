import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import {
	ControlContainer,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-authorisation-into-service-section-edit',
	templateUrl: './authorisation-into-service-section-edit.component.html',
	styleUrls: ['./authorisation-into-service-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupDateComponent],
})
export class AuthorisationIntoServiceSectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

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
		const vehicleControls = this.trailerFields;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	get trailerFields(): Partial<Record<keyof TechRecordType<'trl'>, FormControl>> {
		return {
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
		};
	}
}
