import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RadioGroupComponent } from '@forms/components/radio-group/radio-group.component';
import {
	CustomFormControl,
	CustomFormGroup,
	FormNodeOption,
	FormNodeTypes,
} from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'app-test-amend-reason',
	templateUrl: './test-amend-reason.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, ReactiveFormsModule, RadioGroupComponent],
})
export class TestAmendReasonComponent {
	router = inject(Router);
	route = inject(ActivatedRoute);

	private routes: Record<number, string> = { 1: 'incorrect-test-type', 2: 'amend-test-details' };

	reasons: Array<FormNodeOption<number>> = [
		{ label: 'The test type is incorrect', value: 1 },
		{
			label: 'The test details are incorrect',
			value: 2,
			hint: 'Change test location, assessor, test details, defects, and results.',
		},
	];

	form = new CustomFormGroup(
		{ name: 'reasonForAmend', type: FormNodeTypes.GROUP },
		{
			reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, 2, [Validators.required]),
		}
	);

	handleSubmit() {
		const reason: number = this.form.get('reason')?.value;

		if (this.form.valid && reason) {
			void this.router.navigate([this.routes[`${reason}`]], { relativeTo: this.route });
		}
	}
}
