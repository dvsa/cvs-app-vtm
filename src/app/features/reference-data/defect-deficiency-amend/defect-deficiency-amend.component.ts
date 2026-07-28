import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { MultiOptions } from '@/src/app/models/options.model';
import { Roles } from '@/src/app/models/roles.enum';
import {
	selectDefectCategoryFromRoute,
	selectDefectDeficiencyFromRoute,
	selectDefectItemFromRoute,
} from '@/src/app/store/defects';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-deficiency-amend',
	templateUrl: './defect-deficiency-amend.component.html',
	styleUrls: ['./defect-deficiency-amend.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		GovukFormGroupSelectComponent,
		ButtonGroupComponent,
		ButtonComponent,
		RoleRequiredDirective,
	],
})
export class DefectDeficiencyAmendComponent {
	fb = inject(FormBuilder);
	store = inject(Store);

	defectCategory = this.store.selectSignal(selectDefectCategoryFromRoute);
	defectItem = this.store.selectSignal(selectDefectItemFromRoute);
	defectDeficiency = this.store.selectSignal(selectDefectDeficiencyFromRoute);

	form = this.fb.group({
		ref: this.fb.control<string>(''),
		deficiencyId: this.fb.control<string>(''),
		deficiencySubId: this.fb.control<string>(''),
		deficiencyText: this.fb.control<string>(''),
		deficiencyCategory: this.fb.control<string>(''),
		stdForProhibition: this.fb.control<boolean>(false),
	});

	deficiencyCategoryOptions: MultiOptions = [
		{ label: 'Minor', value: 'minor' },
		{ label: 'Major', value: 'major' },
		{ label: 'Dangerous', value: 'dangerous' },
		{ label: 'Advisory', value: 'advisory' },
	];

	roles = Roles;

	constructor() {
		effect(() => {
			const deficiency = this.defectDeficiency();
			if (!deficiency) return;

			this.form.patchValue(deficiency);
		});
	}

	handleSubmit() {}

	handleCancel() {}
}
