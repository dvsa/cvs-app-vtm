import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { Roles } from '@/src/app/models/roles.enum';
import { selectDefectCategoryFromRoute } from '@/src/app/store/defects';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-defect-item-create',
	templateUrl: './defect-item-create.component.html',
	styleUrls: ['./defect-item-create.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
		ButtonComponent,
		ButtonGroupComponent,
		RoleRequiredDirective,
	],
})
export class DefectItemCreateComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);
	defectCategory = this.store.selectSignal(selectDefectCategoryFromRoute);
	validators = inject(CommonValidatorsService);
	errorService = inject(GlobalErrorService);

	form = this.fb.group({
		itemNumber: this.fb.control<string | null>(null, [
			this.validators.required('Item number'),
			this.validators.maxLength(16, 'Item number'),
		]),
		itemDescription: this.fb.control<string | null>(null, [
			this.validators.required('English description'),
			this.validators.maxLength(4096, 'English description'),
		]),
		itemDescriptionWelsh: this.fb.control<string | null>(null, [
			this.validators.required('Welsh description'),
			this.validators.maxLength(4096, 'Welsh description'),
		]),
	});

	roles = Roles;

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
