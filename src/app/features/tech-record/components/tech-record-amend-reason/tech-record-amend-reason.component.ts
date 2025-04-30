import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';
import {
	CustomFormControl,
	CustomFormGroup,
	FormNodeOption,
	FormNodeTypes,
} from '@services/dynamic-forms/dynamic-form.types';
import { RadioGroupComponent } from '../../../../forms/components/radio-group/radio-group.component';

@Component({
	selector: 'app-tech-amend-reason',
	templateUrl: './tech-record-amend-reason.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, ReactiveFormsModule, RadioGroupComponent],
})
export class TechRecordAmendReasonComponent {
	reasons: Array<FormNodeOption<string>> = [
		{
			label: 'Correcting an error',
			value: ReasonForEditing.CORRECTING_AN_ERROR,
			hint: 'Amend the current technical record',
		},
		{
			label: 'Notifiable alteration needed',
			value: ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED,
			hint: 'Create a new provisional technical record',
		},
	];

	form: CustomFormGroup;

	constructor(
		private errorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.errorService.clearErrors();

		this.form = new CustomFormGroup(
			{ name: 'reasonForAmend', type: FormNodeTypes.GROUP },
			{
				reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [
					Validators.required,
				]),
			}
		);
	}

	handleSubmit(): void {
		const reason: string = this.form.get('reason')?.value;
		const errors: GlobalError[] = [
			{
				error: 'Reason for amending is required',
				anchorLink: 'reasonForAmend',
			},
		];

		if (this.form.valid) {
			this.errorService.clearErrors();
			if (reason) {
				void this.router.navigate([`../${reason}`], { relativeTo: this.route });
			}

			return;
		}

		this.errorService.setErrors(errors);
	}
}
