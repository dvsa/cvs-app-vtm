import { FormGroupFrom } from '@/src/app/models/form.model';
import { Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

@Component({
	selector: 'app-custom-defects',
	templateUrl: './custom-defects.component.html',
	imports: [FormsModule, ReactiveFormsModule],
})
export class CustomDefectsComponent {
	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();

	addCustomDefect(): void {}

	removeCustomDefect(index: number): void {}
}
