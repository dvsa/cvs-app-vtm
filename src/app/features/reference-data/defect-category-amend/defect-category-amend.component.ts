import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukCheckboxGroupComponent } from '@/src/app/forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions } from '@/src/app/models/options.model';
import { Roles } from '@/src/app/models/roles.enum';
import { selectDefectCategoryFromRoute } from '@/src/app/store/defects';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-category-amend',
	templateUrl: './defect-category-amend.component.html',
	styleUrls: ['./defect-category-amend.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		GovukCheckboxGroupComponent,
		RoleRequiredDirective,
		ButtonComponent,
		ButtonGroupComponent,
	],
})
export class DefectCategoryAmendComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	validators = inject(CommonValidatorsService);
	errorService = inject(GlobalErrorService);
	defectCategory = this.store.selectSignal(selectDefectCategoryFromRoute);

	form = this.fb.group({
		imNumber: this.fb.control<number | null>(null, [this.validators.required('IM number')]),
		imDescription: this.fb.nonNullable.control<string | null>(null, [
			this.validators.required('English description'),
			this.validators.maxLength(4096, 'English description'),
		]),
		imDescriptionWelsh: this.fb.nonNullable.control<string | null>(null, [
			this.validators.required('Welsh description'),
			this.validators.maxLength(4096, 'Welsh description'),
		]),
		forVehicleType: this.fb.nonNullable.control<string[]>([]),
	});

	roles = Roles;
	vehicleTypeOptions: MultiOptions = [
		{ label: 'PSV', value: 'psv' },
		{ label: 'HGV', value: 'hgv' },
		{ label: 'TRL', value: 'trl' },
	];

	constructor() {
		effect(() => {
			const defectCategory = this.defectCategory();
			if (!defectCategory) return;
			this.form.patchValue(defectCategory);
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
		this.router.navigate(['..'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
	}
}
