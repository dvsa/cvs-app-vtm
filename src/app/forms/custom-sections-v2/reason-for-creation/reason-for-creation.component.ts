import { Modes } from '@/src/app/models/modes.enum';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
	selector: 'app-reason-for-creation',
	templateUrl: './reason-for-creation.component.html',
	styleUrls: ['./reason-for-creation.component.scss'],
	imports: [ReactiveFormsModule, GovukFormGroupTextareaComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonForCreationComponent extends EditBaseComponent implements OnInit, OnDestroy {
	techRecord = input.required<V3TechRecordModel>();
	filters = input<string[]>([]);
	mode = input.required<Modes>();

	form = this.fb.group({
		techRecord_reasonForCreation: this.fb.control('', [
			this.commonValidators.required('Reason for creation', 'reason-for-creation', 'techRecord_reasonForCreation'),
			this.commonValidators.maxLength(100, 'Reason for creation', 'reason-for-creation'),
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
	}

	generateHintMessage(): string {
		// TODO: Update this method to return a dynamic hint message
		// based on if user is creating or amending a record.
		// return 'Enter a reason for amending this technical record';

		return 'Enter a reason for creating this technical record';
	}
}
