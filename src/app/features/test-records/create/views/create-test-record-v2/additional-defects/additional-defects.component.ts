import { FormGroupFrom } from '@/src/app/models/form.model';
import { Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-additional-defects',
	templateUrl: './additional-defects.component.html',
	imports: [FormsModule, ReactiveFormsModule],
})
export class AdditionalDefectsComponent {
	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();

	addAdditionalDefect(): void {}

	removeAdditionalDefect(index: number): void {}
}
