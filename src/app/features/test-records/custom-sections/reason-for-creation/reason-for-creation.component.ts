import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { TestService } from '@/src/app/services/test/test.service';
import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { Modes } from '@models/modes.enum';

@Component({
	selector: 'app-test-reason-for-creation',
	templateUrl: './reason-for-creation.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
	styleUrls: ['./reason-for-creation.component.scss'],
})
export class ReasonForCreationComponent implements OnInit {
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);

	mode = input.required<Modes>();

	form = this.testService.form;

	ngOnInit(): void {
		this.addValidators();
	}

	addValidators(): void {
		this.form.controls.reasonForCreation.setValidators([
			this.commonValidators.required('Reason for creation'),
			this.commonValidators.maxLength(100, 'Reason for creation'),
		]);
	}

	protected readonly Modes = Modes;
}
