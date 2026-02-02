import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { FormGroupFrom } from '@/src/app/models/form.model';
import { Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupRadioComponent],
})
export class TestComponent {
	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();
}
