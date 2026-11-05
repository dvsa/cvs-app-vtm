import { Component, Injector, OnDestroy, OnInit, Signal, effect, inject, signal, viewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
import { ValidatorNames } from '@models/validators.enum';
import { Store } from '@ngrx/store';
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
import { ReplaySubject, take } from 'rxjs';

@Component({
	selector: 'app-reference-data-delete',
	templateUrl: './reference-data-delete.component.html',
	imports: [RoleRequiredDirective, DynamicFormGroupComponent_1, ButtonGroupComponent, ButtonComponent],
})
export class ReferenceDataDeleteComponent implements OnInit, OnDestroy {
	globalErrorService = inject(GlobalErrorService);
	referenceDataService = inject(ReferenceDataService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject<Store<ReferenceDataState>>(Store<ReferenceDataState>);
	titleService = inject(Title);

	type!: ReferenceDataResourceType;
	refDataAdminType!: Signal<any>;
	// the item being deleted; assigned in ngOnInit once the type and key are known from the route
	refData: Signal<any> = signal(undefined);
	private readonly injector = inject(Injector);
	key!: string;
	reasonForDeletion: any;
	isFormDirty = false;
	isFormInvalid = true;
	destroy$ = new ReplaySubject<boolean>(1);

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

		this.refDataAdminType = this.store.selectSignal(
			selectReferenceDataByResourceKey(ReferenceDataResourceType.ReferenceDataAdminType, this.type)
		);
		this.refData = this.store.selectSignal(selectReferenceDataByResourceKey(this.type, this.key));
		// the label arrives with the admin-type fetch, so keep the title reactive
		effect(
			() =>
				this.titleService.setTitle(
					`Delete this ${this.refDataAdminType()?.labelSingular} - Vehicle Testing Management`
				),
			{ injector: this.injector }
		);
	}

	ngOnDestroy(): void {
		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get roles(): typeof Roles {
		return Roles;
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
	}
}
