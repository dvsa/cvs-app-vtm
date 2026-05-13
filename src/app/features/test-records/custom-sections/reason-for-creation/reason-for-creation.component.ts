import { TestService } from '@/src/app/services/test/test.service';
import { Component, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { Modes } from '@models/modes.enum';

@Component({
	selector: 'app-test-reason-for-creation',
	templateUrl: './reason-for-creation.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
	styleUrls: ['./reason-for-creation.component.scss'],
})
export class ReasonForCreationComponent {
	testService = inject(TestService);

	mode = input.required<Modes>();

	form = this.testService.form;
}
