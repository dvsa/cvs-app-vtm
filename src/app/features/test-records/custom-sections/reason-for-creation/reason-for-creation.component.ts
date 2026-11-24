import { TestService } from '@/src/app/services/test/test.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';

@Component({
	selector: 'app-test-reason-for-creation',
	templateUrl: './reason-for-creation.component.html',
	imports: [FormField, GovukFormGroupTextareaComponent],
	styleUrls: ['./reason-for-creation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonForCreationComponent {
	readonly testService = inject(TestService);
	readonly form = this.testService.form;
}
