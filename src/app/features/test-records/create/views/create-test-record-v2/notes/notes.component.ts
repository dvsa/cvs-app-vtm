import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { FormGroupFrom } from '@/src/app/models/form.model';
import { Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-notes',
	templateUrl: './notes.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
})
export class NotesComponent {
	form = input<FormGroup<FormGroupFrom<TestResultSchema>>>();
}
