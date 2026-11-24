import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { CustomDefectFormModel } from '@/src/app/services/test/test-result-form.model';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { SpecialistCustomDefectsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-custom-defects',
	templateUrl: './custom-defects.component.html',
	imports: [
		FormField,
		ButtonComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		DefaultNullOrEmpty,
	],
	styleUrls: ['./custom-defects.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDefectsComponent {
	store = inject(Store);
	testService = inject(TestService);

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	readonly savedCustomDefects = computed<SpecialistCustomDefectsSchema[]>(
		() => this.testResult()?.testTypes[0].customDefects ?? []
	);

	readonly FormNodeWidth = FormNodeWidth;

	onAddCustomDefect(): void {
		this.updateCustomDefects((customDefects) => [...customDefects, { defectName: null, defectNotes: null }]);
	}

	onRemoveCustomDefect(index: number): void {
		this.updateCustomDefects((customDefects) => customDefects.filter((_, i) => i !== index));
	}

	private updateCustomDefects(update: (customDefects: CustomDefectFormModel[]) => CustomDefectFormModel[]): void {
		this.testService.testType.customDefects().value.update(update);
	}
}
