import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { RadioGroupComponent } from '@forms/components/radio-group/radio-group.component';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, selectAllReferenceDataByResourceType } from '@store/reference-data';
import { map } from 'rxjs';

@Component({
	selector: 'app-reference-data-select-type',
	templateUrl: './reference-data-select-type.component.html',
	imports: [
		RoleRequiredDirective,
		FormsModule,
		ReactiveFormsModule,
		RadioGroupComponent,
		ButtonGroupComponent,
		ButtonComponent,
		RouterOutlet,
		AsyncPipe,
	],
})
export class ReferenceDataSelectTypeComponent {
	globalErrorService = inject(GlobalErrorService);
	referenceDataService = inject(ReferenceDataService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject<Store<ReferenceDataState>>(Store<ReferenceDataState>);

	form: CustomFormGroup = new CustomFormGroup(
		{ name: 'form-group', type: FormNodeTypes.GROUP },
		{
			referenceType: new CustomFormControl({ name: 'referenceType', type: FormNodeTypes.CONTROL }, undefined, [
				Validators.required,
			]),
		}
	);

	options$ = this.store.pipe(
		select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.ReferenceDataAdminType)),
		map(
			(types) =>
				types
					?.sort((a, b) => (a.label ?? a.resourceType).localeCompare(b.label ?? b.resourceType))
					.map((type) => ({
						label: type.label ?? type.resourceKey.toString(),
						value: type.resourceKey.toString(),
					})) ?? []
		)
	);

	constructor() {
		this.referenceDataService.loadReferenceData(ReferenceDataResourceType.ReferenceDataAdminType);
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get isFormValid(): boolean {
		const errors: GlobalError[] = [];
		DynamicFormService.validate(this.form, errors);
		this.globalErrorService.setErrors(errors);
		return this.form.valid;
	}
	cancel(): void {
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	navigateTo(type: string): void {
		if (this.isFormValid) {
			void this.router.navigate([type], { relativeTo: this.route });
		}
	}
}
