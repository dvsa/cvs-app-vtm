import { FormGroupFrom } from '@/src/app/models/form.model';
import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-required-standards',
	templateUrl: './required-standards.component.html',
})
export class RequiredStandardsComponent {
	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();
}
