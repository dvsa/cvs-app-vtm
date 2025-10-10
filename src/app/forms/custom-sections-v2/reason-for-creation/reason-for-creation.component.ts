import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-reason-for-creation',
	templateUrl: './reason-for-creation.component.html',
	styleUrls: ['./reason-for-creation.component.scss'],
	imports: [ReactiveFormsModule, GovukFormGroupTextareaComponent],
})
export class ReasonForCreationComponent extends EditBaseComponent implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	form = this.fb.group({
		techRecord_reasonForCreation: this.fb.control('', [
			this.commonValidators.required('Reason for creation is required'),
			this.commonValidators.maxLength(100, 'Reason for creation must be less than or equal to 100 characters'),
		]),
	});

	ngOnInit(): void {
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

	generateHintMessage(): string {
		// TODO: Update this method to return a dynamic hint message
		// based on if user is creating or amending a record.
		// return 'Enter a reason for amending this technical record';

		return 'Enter a reason for creating this technical record';
	}
}
