import { AsyncPipe } from '@angular/common';
import { Component, OnInit, viewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Roles } from '@models/roles.enum';
import { ValidatorNames } from '@models/validators.enum';
import { Store, select } from '@ngrx/store';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormGroup,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import {
	ReferenceDataState,
	deleteReferenceDataItem,
	fetchReferenceDataByKey,
	selectReferenceDataByResourceKey,
} from '@store/reference-data';
import { Observable, take } from 'rxjs';
import { ButtonGroupComponent } from '../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { RoleRequiredDirective } from '../../../directives/app-role-required/app-role-required.directive';
import { DynamicFormGroupComponent as DynamicFormGroupComponent_1 } from '../../../forms/components/dynamic-form-group/dynamic-form-group.component';

@Component({
	selector: 'app-reference-data-delete',
	templateUrl: './reference-data-delete.component.html',
	imports: [RoleRequiredDirective, DynamicFormGroupComponent_1, ButtonGroupComponent, ButtonComponent, AsyncPipe],
})
export class ReferenceDataDeleteComponent implements OnInit {
	type!: ReferenceDataResourceType;
	key!: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	reasonForDeletion: any;
	isFormDirty = false;
	isFormInvalid = true;

	reasonTemplate = {
		name: 'reason-for-deletion',
		type: FormNodeTypes.GROUP,
		label: 'reason',
		children: [
			{
				name: 'reason',
				label: 'Reason for Deletion',
				type: FormNodeTypes.CONTROL,
				editType: FormNodeEditTypes.TEXTAREA,
				validators: [
					{
						name: ValidatorNames.Required,
					},
				],
			},
		],
	};

	readonly sections = viewChildren(DynamicFormGroupComponent);

	constructor(
		public globalErrorService: GlobalErrorService,
		private referenceDataService: ReferenceDataService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<ReferenceDataState>
	) {}

	ngOnInit(): void {
		this.route.parent?.params.pipe(take(1)).subscribe((params) => {
			this.type = params['type'];

			this.referenceDataService.loadReferenceDataByKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type);
		});

		this.route.params.pipe(take(1)).subscribe((params) => {
			this.key = decodeURIComponent(params['key']);

			if (this.type && this.key) {
				this.store.dispatch(fetchReferenceDataByKey({ resourceType: this.type, resourceKey: this.key }));
			}
		});
	}

	get roles(): typeof Roles {
		return Roles;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get refData$(): Observable<any> {
		return this.store.pipe(select(selectReferenceDataByResourceKey(this.type, decodeURIComponent(this.key))));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	get refDataAdminType$(): Observable<any> {
		return this.store.pipe(
			select(selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type))
		);
	}

	get widths(): typeof FormNodeWidth {
		return FormNodeWidth;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleFormChange(event: any) {
		this.reasonForDeletion = event;
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

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['../..'], { relativeTo: this.route });
	}

	handleSubmit() {
		this.checkForms();

		if (this.isFormInvalid || !this.reasonForDeletion) return;

		this.store.dispatch(
			deleteReferenceDataItem({
				resourceType: this.type,
				resourceKey: this.key,
				reason: this.reasonForDeletion.reason,
			})
		);
		this.navigateBack();
	}
}
