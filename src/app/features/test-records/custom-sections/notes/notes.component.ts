import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TestService } from '@/src/app/services/test/test.service';
import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { Modes } from '@models/modes.enum';

@Component({
	selector: 'app-test-notes',
	templateUrl: './notes.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent, DefaultNullOrEmpty],
	styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);

	mode = input.required<Modes>();

	form = this.testService.form;

	ngOnInit(): void {
		this.addValidators();
	}

	addValidators(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.additionalNotesRecorded.setValidators([
				this.commonValidators.maxLength(500, 'Additional notes (optional)'),
			]);
	}

	protected readonly Modes = Modes;
}
