import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { Roles } from '@/src/app/models/roles.enum';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	DefectCategoryAdditionalInfoComponent,
	createAdditionalInfoForm,
	serialiseAdditionalInfo,
} from '../defect-category-additional-info/defect-category-additional-info.component';

@Component({
	selector: 'app-defect-category-create',
	templateUrl: './defect-category-create.component.html',
	styleUrls: ['./defect-category-create.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		RoleRequiredDirective,
		ButtonComponent,
		ButtonGroupComponent,
		DefectCategoryAdditionalInfoComponent,
	],
})
export class DefectCategoryCreateComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	validators = inject(CommonValidatorsService);
	errorService = inject(GlobalErrorService);
	vehicleTypes = this.fb.nonNullable.control<string[]>([]);

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
		forVehicleType: this.vehicleTypes,
		additionalInfo: createAdditionalInfoForm(this.fb, this.vehicleTypes),
	});

	roles = Roles;
	getFormValue() {
		const { additionalInfo, ...category } = this.form.getRawValue();
		return {
			...category,
			additionalInfo: serialiseAdditionalInfo(this.form.controls.additionalInfo, category.forVehicleType),
		};
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
