import { FormGroupFrom } from '@/src/app/models/form.model';
import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-defects',
	templateUrl: './defects.component.html',
})
export class DefectsComponent {
	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();
}
