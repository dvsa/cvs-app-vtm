import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, viewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import {
	DynamicFormGroupComponent,
	DynamicFormGroupComponent as DynamicFormGroupComponent_1,
} from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { Store, select } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormGroup, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { ReferenceDataState, createReferenceDataItem, selectReferenceDataByResourceKey } from '@store/reference-data';
import { Observable, catchError, filter, of, switchMap, take, throwError } from 'rxjs';

@Component({
	selector: 'app-reference-data-add',
	templateUrl: './reference-data-add.component.html',
	imports: [RoleRequiredDirective, DynamicFormGroupComponent_1, ButtonGroupComponent, ButtonComponent, AsyncPipe],
})
export class ReferenceDataCreateComponent implements OnInit {
	globalErrorService = inject(GlobalErrorService);
	dfs = inject(DynamicFormService);
	referenceDataService = inject(ReferenceDataService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store<ReferenceDataState>);

	type: ReferenceDataResourceType = ReferenceDataResourceType.Brakes;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	newRefData: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any = {};
	isFormDirty = false;
	isFormInvalid = true;

	readonly sections = viewChildren(DynamicFormGroupComponent);

	ngOnInit(): void {
		this.route.parent?.params.pipe(take(1)).subscribe((params) => {
			this.type = params['type'];
			this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get refDataAdminType$(): Observable<any> {
		return this.store.pipe(
			select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type))
		);
	}

	get roles(): typeof Roles {
		return Roles;
	}

	get widths(): typeof FormNodeWidth {
		return FormNodeWidth;
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleFormChange(event: any) {
		this.newRefData = event;
	}

	handleSubmit() {
		this.checkForms();

		if (this.isFormInvalid) return;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const referenceData: any = {};

		Object.keys(this.newRefData)
			.filter((newRefDataKey) => newRefDataKey !== 'resourceKey')
			.forEach((dataKey) => {
				referenceData[`${dataKey}`] = this.newRefData[`${dataKey}`];
			});

		this.globalErrorService.errors$
			.pipe(
				take(1),
				filter((errors) => !errors.length),
				switchMap(() => this.referenceDataService.fetchReferenceDataByKey(this.type, this.newRefData.resourceKey)),
				take(1),
				catchError((error) => (error.status === 200 ? of(true) : throwError(() => new Error('Error'))))
			)
			.subscribe({
				next: (res) => {
					if (res)
						return this.globalErrorService.addError({
							error: 'Resource Key already exists',
							anchorLink: 'newReferenceData',
						});
				},
				error: (e) => {
					if (e.status === 404) {
						of(true);
					} else {
						this.store.dispatch(
							createReferenceDataItem({
								resourceType: this.type,
								resourceKey: encodeURIComponent(String(this.newRefData.resourceKey)),
								payload: referenceData,
							})
						);
						this.navigateBack();
					}
				},
			});
	}

	checkForms(): void {
		const forms = this.sections().map((section) => section.form) as Array<CustomFormGroup>;

		this.isFormDirty = forms.some((form) => form.dirty);

		this.setErrors(forms);

		this.isFormInvalid = forms.some((form) => form.invalid);
	}

	setErrors(forms: Array<CustomFormGroup>): void {
		const errors: GlobalError[] = [];

		forms.forEach((form) => DynamicFormService.validate(form, errors));

		if (errors.length) {
			this.globalErrorService.setErrors(errors);
			return;
		}

		this.globalErrorService.clearErrors();
	}
}
