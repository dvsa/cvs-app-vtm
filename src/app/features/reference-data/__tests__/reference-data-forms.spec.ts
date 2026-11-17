import { HttpErrorResponse } from '@angular/common/http';
import { Component, forwardRef, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { initialAppState } from '@store/index';
import {
	amendReferenceDataItem,
	createReferenceDataItem,
	initialReferenceDataState,
	referenceDataFeatureState,
} from '@store/reference-data';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ReferenceDataCreateComponent } from '../reference-data-add/reference-data-add.component';
import { ReferenceDataAmendComponent } from '../reference-data-amend/reference-data-amend.component';

@Component({
	selector: 'app-dynamic-form-group',
	template: '',
	providers: [{ provide: DynamicFormGroupComponent, useExisting: forwardRef(() => TestFormSectionComponent) }],
})
class TestFormSectionComponent {
	readonly template = input<unknown>();
	readonly data = input<unknown>();
	readonly edit = input(false);
	readonly formChange = output<unknown>();
	form = new CustomFormGroup(
		{ name: 'newReferenceData', type: FormNodeTypes.GROUP },
		{
			resourceKey: new CustomFormControl(
				{ name: 'resourceKey', label: 'Resource Key', type: FormNodeTypes.CONTROL },
				'B/12 #',
				Validators.required
			),
			description: new CustomFormControl(
				{ name: 'description', label: 'Description', type: FormNodeTypes.CONTROL },
				'Service brake',
				Validators.required
			),
		}
	);
	ngOnDestroy = vi.fn();
}

describe.each(['add', 'amend'] as const)('Reference data %s form behaviour', (mode) => {
	let component: ReferenceDataCreateComponent | ReferenceDataAmendComponent;
	let fixture: ComponentFixture<ReferenceDataCreateComponent | ReferenceDataAmendComponent>;
	let section: TestFormSectionComponent;
	let store: MockStore;
	let referenceData: {
		loadReferenceDataByKey: ReturnType<typeof vi.fn>;
		fetchReferenceDataByKey: ReturnType<typeof vi.fn>;
	};
	let globalErrors: {
		errors$: BehaviorSubject<GlobalError[]>;
		setErrors: ReturnType<typeof vi.fn>;
		clearErrors: ReturnType<typeof vi.fn>;
		addError: ReturnType<typeof vi.fn>;
	};
	let navigate: ReturnType<typeof vi.fn>;
	let setTitle: ReturnType<typeof vi.fn>;
	const type = ReferenceDataResourceType.Brakes;
	const key = 'B/12 #';
	const savedItem = {
		resourceType: type,
		resourceKey: key,
		description: 'Original brake',
		createdName: 'Original User',
	};

	function referenceState(labelSingular = 'brake') {
		return {
			...initialReferenceDataState,
			[type]: { ids: [key], entities: { [key]: savedItem }, loading: false },
			[ReferenceDataResourceType.ReferenceDataAdminType]: {
				ids: [type],
				entities: { [type]: { resourceKey: type, labelSingular } },
				loading: false,
			},
		};
	}

	beforeEach(() => {
		referenceData = {
			loadReferenceDataByKey: vi.fn(),
			fetchReferenceDataByKey: vi.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 }))),
		};
		const errors$ = new BehaviorSubject<GlobalError[]>([]);
		globalErrors = {
			errors$,
			addError: vi.fn(),
			setErrors: vi.fn((errors: GlobalError[]) => errors$.next(errors)),
			clearErrors: vi.fn(() => errors$.next([])),
		};
		navigate = vi.fn().mockResolvedValue(true);
		setTitle = vi.fn();
		const componentType = mode === 'add' ? ReferenceDataCreateComponent : ReferenceDataAmendComponent;
		TestBed.configureTestingModule({
			imports: [componentType],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: ReferenceDataService, useValue: referenceData },
				{ provide: GlobalErrorService, useValue: globalErrors },
				{ provide: DynamicFormService, useValue: {} },
				{ provide: Title, useValue: { setTitle } },
				{ provide: Router, useValue: { navigate } },
				{
					provide: ActivatedRoute,
					useValue: { parent: { params: of({ type }) }, params: of({ key: encodeURIComponent(key) }) },
				},
			],
		});
		TestBed.overrideComponent(componentType, {
			set: {
				imports: [TestFormSectionComponent],
				template: '<app-dynamic-form-group (formChange)="handleFormChange($event)" />',
			},
		});
		store = TestBed.inject(MockStore);
		store.overrideSelector(referenceDataFeatureState, referenceState());
		fixture = TestBed.createComponent(componentType);
		component = fixture.componentInstance;
		fixture.detectChanges();
		section = component.sections()[0] as unknown as TestFormSectionComponent;
		vi.spyOn(store, 'dispatch');
	});

	it('loads the admin definition for the type supplied by the parent route', () => {
		expect(component.type).toBe(type);
		expect(referenceData.loadReferenceDataByKey).toHaveBeenCalledWith(
			ReferenceDataResourceType.ReferenceDataAdminType,
			type
		);
	});

	it('updates the page title when the admin definition changes', () => {
		const prefix = mode === 'add' ? 'Add a new' : 'Amend this';
		expect(setTitle).toHaveBeenLastCalledWith(`${prefix} brake - Vehicle Testing Management`);
		store.overrideSelector(referenceDataFeatureState, referenceState('brake code'));
		store.refreshState();
		fixture.detectChanges();
		expect(setTitle).toHaveBeenLastCalledWith(`${prefix} brake code - Vehicle Testing Management`);
	});

	it('blocks submission and shows validation errors for an invalid form', () => {
		const description = section.form.controls['description'];
		description.setValue('');
		description.markAsDirty();
		component.handleSubmit();

		expect(component.isFormInvalid).toBe(true);
		expect(component.isFormDirty).toBe(true);
		expect(description.touched).toBe(true);
		expect(globalErrors.setErrors).toHaveBeenCalledExactlyOnceWith([
			{ error: 'Description is required', anchorLink: 'description' },
		]);
		expect(store.dispatch).not.toHaveBeenCalled();
		expect(referenceData.fetchReferenceDataByKey).not.toHaveBeenCalled();
		expect(navigate).not.toHaveBeenCalled();
	});

	it('clears stale validation errors after the form is corrected', () => {
		section.form.controls['description'].setValue('');
		component.checkForms();
		expect(globalErrors.errors$.value).toHaveLength(1);
		section.form.controls['description'].setValue('Corrected description');
		component.checkForms();
		expect(component.isFormInvalid).toBe(false);
		expect(globalErrors.errors$.value).toEqual([]);
	});

	it('combines errors across form sections', () => {
		const otherForm = new CustomFormGroup(
			{ name: 'second', type: FormNodeTypes.GROUP },
			{
				code: new CustomFormControl(
					{ name: 'code', label: 'Code', type: FormNodeTypes.CONTROL },
					'',
					Validators.required
				),
			}
		);
		section.form.controls['description'].setValue('');
		component.setErrors([section.form, otherForm]);
		expect(globalErrors.setErrors).toHaveBeenCalledExactlyOnceWith([
			{ error: 'Description is required', anchorLink: 'description' },
			{ error: 'Code is required', anchorLink: 'code' },
		]);
	});

	it('clears errors and navigates to the parent when cancelled', () => {
		component.navigateBack();
		expect(globalErrors.clearErrors).toHaveBeenCalled();
		expect(navigate).toHaveBeenCalledExactlyOnceWith(['..'], { relativeTo: TestBed.inject(ActivatedRoute) });
		expect(store.dispatch).not.toHaveBeenCalled();
	});

	if (mode === 'add') {
		const getComponent = () => component as ReferenceDataCreateComponent;

		it('creates a missing key using form values even when no change event was emitted', () => {
			component.handleSubmit();
			expect(referenceData.fetchReferenceDataByKey).toHaveBeenCalledExactlyOnceWith(type, key);
			expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(
				createReferenceDataItem({
					resourceType: type,
					resourceKey: encodeURIComponent(key),
					payload: { description: 'Service brake' },
				})
			);
			expect(navigate).toHaveBeenCalledOnce();
		});

		it('uses the latest emitted form data and separates the resource key from the payload', () => {
			const data = { resourceKey: 'NEW/KEY', description: 'New description' };
			section.formChange.emit(data);
			component.handleSubmit();
			expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(
				createReferenceDataItem({
					resourceType: type,
					resourceKey: 'NEW%2FKEY',
					payload: { description: 'New description' },
				})
			);
			expect(data).toEqual({ resourceKey: 'NEW/KEY', description: 'New description' });
		});

		it('shows a duplicate key error without creating a resource or leaving the form', () => {
			referenceData.fetchReferenceDataByKey.mockReturnValue(of(savedItem));
			component.handleSubmit();
			expect(globalErrors.addError).toHaveBeenCalledExactlyOnceWith({
				error: 'Resource Key already exists',
				anchorLink: 'newReferenceData',
			});
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(navigate).not.toHaveBeenCalled();
		});

		it('treats an HTTP 200 parsing error as an existing key', () => {
			referenceData.fetchReferenceDataByKey.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 200 })));
			component.handleSubmit();
			expect(globalErrors.addError).toHaveBeenCalledExactlyOnceWith({
				error: 'Resource Key already exists',
				anchorLink: 'newReferenceData',
			});
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(navigate).not.toHaveBeenCalled();
		});

		it.each([0, 403, 500])('does not create a resource when the key check fails with status %s', (status) => {
			referenceData.fetchReferenceDataByKey.mockReturnValue(throwError(() => new HttpErrorResponse({ status })));
			component.handleSubmit();
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(navigate).not.toHaveBeenCalled();
			expect(globalErrors.addError).toHaveBeenCalledExactlyOnceWith({
				error: 'Unable to check whether Resource Key already exists. Try again later.',
				anchorLink: 'newReferenceData',
			});
		});

		it('does not submit when there are no form sections or form values', () => {
			vi.spyOn(component, 'sections').mockReturnValue([]);
			getComponent().newRefData = undefined;
			component.handleSubmit();
			expect(referenceData.fetchReferenceDataByKey).not.toHaveBeenCalled();
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(navigate).not.toHaveBeenCalled();
		});
	} else {
		const getComponent = () => component as ReferenceDataAmendComponent;

		it('decodes the route key and loads the current reference item', () => {
			expect(getComponent().key).toBe(key);
			expect(referenceData.loadReferenceDataByKey).toHaveBeenCalledWith(type, key);
			expect(getComponent().data()).toEqual(savedItem);
			expect(getComponent().amendedData).toEqual(savedItem);
		});

		it('does not overwrite user edits when the stored item changes', () => {
			const changedItem = { ...savedItem, description: 'Updated from server' };
			section.formChange.emit({ description: 'User changes' });
			store.overrideSelector(referenceDataFeatureState, {
				...referenceState(),
				[type]: { ids: [key], entities: { [key]: changedItem }, loading: false },
			});
			store.refreshState();
			expect(getComponent().data()).toEqual(changedItem);
			expect(getComponent().amendedData).toEqual({ description: 'User changes' });
		});

		it('returns to the list without saving when the form has not changed', () => {
			component.handleSubmit();
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(navigate).toHaveBeenCalledOnce();
			expect(section.ngOnDestroy).not.toHaveBeenCalled();
		});

		it('merges clean form changes with the existing item and encodes the key once', () => {
			section.form.markAsDirty();
			section.form.addControl(
				'displayOnly',
				new CustomFormControl({ name: 'displayOnly', type: FormNodeTypes.TITLE }, 'Not a payload field')
			);
			component.handleSubmit();
			expect(store.dispatch).toHaveBeenCalledExactlyOnceWith(
				amendReferenceDataItem({
					resourceType: type,
					resourceKey: encodeURIComponent(key),
					payload: { ...savedItem, description: 'Service brake' },
				})
			);
			expect(section.ngOnDestroy).toHaveBeenCalledOnce();
			expect(navigate).toHaveBeenCalledOnce();
		});
	}
});
