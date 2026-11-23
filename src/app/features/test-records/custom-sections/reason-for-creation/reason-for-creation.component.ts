import { TestService } from '@/src/app/services/test/test.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';

@Component({
	selector: 'app-test-reason-for-creation',
	templateUrl: './reason-for-creation.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent],
	styleUrls: ['./reason-for-creation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonForCreationComponent {
	readonly testService = inject(TestService);
	readonly form = this.testService.form;
}
