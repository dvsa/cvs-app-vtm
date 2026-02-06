import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { FormGroupFrom } from '@/src/app/models/form.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestTypesService } from '@/src/app/services/test-types/test-types.service';
import { Component, inject, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupRadioComponent, GovukFormGroupInputComponent],
})
export class TestComponent {
	testTypesService = inject(TestTypesService);

	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();

	FormNodeWidth = FormNodeWidth;
}
