import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupCheckboxComponent } from '@/src/app/forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions } from '@/src/app/models/options.model';
import { Roles } from '@/src/app/models/roles.enum';
import {
	selectDefectCategoryFromRoute,
	selectDefectDeficiencyFromRoute,
	selectDefectItemFromRoute,
} from '@/src/app/store/defects';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
		GovukFormGroupCheckboxComponent,
		GovukCheckboxGroupComponent,
		ButtonGroupComponent,
		ButtonComponent,
		RoleRequiredDirective,
	],
})
export class DefectDeficiencyAmendComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	validators = inject(CommonValidatorsService);
	errorService = inject(GlobalErrorService);

	defectCategory = this.store.selectSignal(selectDefectCategoryFromRoute);
	defectItem = this.store.selectSignal(selectDefectItemFromRoute);
	defectDeficiency = this.store.selectSignal(selectDefectDeficiencyFromRoute);

	form = this.fb.group({
		ref: this.fb.control<string>('', [
			this.validators.required('Reference'),
			this.validators.maxLength(16, 'Reference'),
		]),
		deficiencyId: this.fb.control<string | null>(null),
		deficiencySubId: this.fb.control<string | null>(null),
		deficiencyText: this.fb.control<string | null>(null, [
			this.validators.required('English description'),
			this.validators.maxLength(4096, 'English description'),
		]),
		deficiencyTextWelsh: this.fb.control<string | null>(null, [
			this.validators.required('Welsh description'),
			this.validators.maxLength(4096, 'Welsh description'),
		]),
		deficiencyCategory: this.fb.control<string | null>(null),
		stdForProhibition: this.fb.control<boolean>(false),
	});

	deficiencyCategoryOptions: MultiOptions = [
		{ label: 'Minor', value: 'minor' },
		{ label: 'Major', value: 'major' },
		{ label: 'Dangerous', value: 'dangerous' },
		{ label: 'Advisory', value: 'advisory' },
	];

	roles = Roles;
	vehicleTypeOptions: MultiOptions = [
		{ label: 'PSV', value: 'psv' },
		{ label: 'HGV', value: 'hgv' },
		{ label: 'TRL', value: 'trl' },
	];

	constructor() {
		effect(() => {
			const deficiency = this.defectDeficiency();
			if (!deficiency) return;
			this.form.patchValue(deficiency);
		});
	}

	handleSubmit() {
		this.errorService.markAllAsTouched(this.form);

		const errors = this.errorService.extractGlobalErrors(this.form);
		if (errors.length > 0) {
			this.errorService.setErrors(errors);
			return;
		}

		// Form is valid
	}

	handleCancel() {
		this.router.navigate(['../..'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
	}
}
