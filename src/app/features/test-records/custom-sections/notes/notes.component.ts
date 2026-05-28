import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-notes',
	templateUrl: './notes.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent, DefaultNullOrEmpty],
	styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
	store = inject(Store);
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);

	mode = input.required<Modes>();

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);

	ngOnInit(): void {
		this.addValidators();
	}

	addValidators(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.additionalNotesRecorded.setValidators([
				this.commonValidators.maxLength(500, 'Additional Notes (optional)'),
			]);
	}

	protected readonly Modes = Modes;
}
