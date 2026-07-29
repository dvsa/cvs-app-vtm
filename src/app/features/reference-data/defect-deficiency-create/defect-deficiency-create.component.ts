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
import { selectDefectCategoryFromRoute, selectDefectItemFromRoute } from '@/src/app/store/defects';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-deficiency-create',
	templateUrl: './defect-deficiency-create.component.html',
	styleUrls: ['./defect-deficiency-create.component.scss'],
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
export class DefectDeficiencyCreateComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	validators = inject(CommonValidatorsService);
	errorService = inject(GlobalErrorService);

	defectCategory = this.store.selectSignal(selectDefectCategoryFromRoute);
	defectItem = this.store.selectSignal(selectDefectItemFromRoute);

	form = this.fb.group({
		ref: this.fb.control<string>(''),
		deficiencyId: this.fb.control<string>(''),
		deficiencySubId: this.fb.control<string>(''),
		deficiencyText: this.fb.control<string>('', [
			this.validators.required('English description'),
			this.validators.maxLength(4096, 'English description'),
		]),
		deficiencyTextWelsh: this.fb.control<string>('', [
			this.validators.required('Welsh description'),
			this.validators.maxLength(4096, 'Welsh description'),
		]),
		deficiencyCategory: this.fb.control<string | null>(null, [this.validators.required('Category')]),
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
