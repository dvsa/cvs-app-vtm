import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-notes',
	templateUrl: './notes.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupTextareaComponent, DefaultNullOrEmpty],
	styleUrls: ['./notes.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent {
	store = inject(Store);
	testService = inject(TestService);

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);

	readonly additionalNotesHint = computed(() => {
		const testType = this.testResult()?.testTypes[0];
		return this.testService.isTestTypeGroup7() && testType?.centralDocs?.issueRequired
			? 'Enter a reason for issuing documents centrally'
			: '';
	});
}
