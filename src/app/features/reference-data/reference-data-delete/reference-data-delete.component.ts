import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { ReferenceDataResourceType } from '@/src/app/models/reference-data.model';
import { Roles } from '@/src/app/models/roles.enum';
import { ReferenceDataService } from '@/src/app/services/reference-data/reference-data.service';
import {
	deleteReferenceDataItem,
	fetchReferenceDataByKey,
	selectReferenceDataAdminTypeByRouteResourceKey,
	selectReferenceDataByResourceKey,
	selectReferenceDataByRouteResourceKey,
} from '@/src/app/store/reference-data';
import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { Store } from '@ngrx/store';

selectReferenceDataByResourceKey;

@Component({
	selector: 'app-reference-data-delete',
	templateUrl: './reference-data-delete.component.html',
	imports: [
		RoleRequiredDirective,
		GovukFormGroupTextareaComponent,
		FormsModule,
		ReactiveFormsModule,
		ButtonGroupComponent,
		ButtonComponent,
	],
})
export class ReferenceDataDeleteComponent {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	route = inject(ActivatedRoute);
	validators = inject(CommonValidatorsService);
	referenceDataService = inject(ReferenceDataService);
	globalErrorService = inject(GlobalErrorService);

	key = input('', { transform: (key: string) => decodeURIComponent(key) });
	type = input(undefined, {
		transform: (type: string | undefined) =>
			type ? (decodeURIComponent(type) as ReferenceDataResourceType) : undefined,
	});

	refData$ = this.store.selectSignal(selectReferenceDataByRouteResourceKey);
	refDataAdmin$ = this.store.selectSignal(selectReferenceDataAdminTypeByRouteResourceKey);

	Roles = Roles;

	form = this.fb.nonNullable.group({
		reason: this.fb.nonNullable.control('', [this.validators.required('Reason for Deletion is required')]),
	});

	constructor() {
		effect(() => {
			const resourceKey = this.key();
			const resourceType = this.type();

			if (resourceType) {
				this.referenceDataService.loadReferenceDataByKey(
					ReferenceDataResourceType.ReferenceDataAdminType,
					resourceType
				);
			}

			if (resourceType && resourceKey) {
				this.store.dispatch(fetchReferenceDataByKey({ resourceType, resourceKey }));
			}
		});
	}

	submit(): void {
		this.form.markAllAsTouched();

		const resourceKey = this.key();
		const resourceType = this.type();

		if (this.form.invalid) {
			this.globalErrorService.setErrors(this.globalErrorService.extractGlobalErrors(this.form));
		}

		if (this.form.valid && resourceKey && resourceType) {
			const reason = this.form.controls.reason.value.replace(/\n/g, '\\n');
			this.store.dispatch(deleteReferenceDataItem({ resourceKey, resourceType, reason }));
		}
	}

	back(): void {
		this.globalErrorService.clearErrors();
		this.router.navigate(['../..'], { relativeTo: this.route });
	}
}
