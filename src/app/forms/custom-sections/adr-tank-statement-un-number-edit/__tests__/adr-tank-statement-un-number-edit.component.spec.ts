import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { GlobalWarningService } from '@core/components/global-warning/global-warning.service';
import { FORM_INJECTION_TOKEN } from '@forms/components/dynamic-form-field/dynamic-form-field.component';

import { provideMockStore } from '@ngrx/store/testing';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';

import { initialAppState } from '@store/index';
import { AdrTankStatementUnNumberEditComponent } from '../adr-tank-statement-un-number-edit.component';

describe('AdrTankStatementUnNumberEditComponent', () => {
	let fb: FormBuilder;
	let component: AdrTankStatementUnNumberEditComponent;
	let fixture: ComponentFixture<AdrTankStatementUnNumberEditComponent>;

	const control = new CustomFormControl({
		name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
		label: 'UN Number',
		type: FormNodeTypes.CONTROL,
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AdrTankStatementUnNumberEditComponent],
			providers: [
				FormBuilder,
				provideMockStore({ initialState: initialAppState }),
				{ provide: GlobalWarningService, useValue: { error$: jest.fn() } },
				{ provide: NG_VALUE_ACCESSOR, useExisting: AdrTankStatementUnNumberEditComponent, multi: true },
				{
					provide: NgControl,
					useValue: {
						control: { key: control.meta.name, value: control },
					},
				},
				{
					provide: FORM_INJECTION_TOKEN,
					useValue: new FormGroup({
						techRecord_adrDetails_additionalNotes_guidanceNotes: new FormControl(null),
					}),
				},
			],
		}).compileComponents();

		fb = TestBed.inject(FormBuilder);
		fixture = TestBed.createComponent(AdrTankStatementUnNumberEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngAfterContentInit', () => {
		it('should add an initial control to the form array once the form is injected into the component', () => {
			const spy = jest.spyOn(component, 'addControl');
			component.ngAfterContentInit();
			expect(spy).toHaveBeenCalled();
			expect(component.formArray.value).toHaveLength(1);
		});
	});

	describe('addControl', () => {
		it('should add a copy of the control to the end of the form array', () => {
			const spy = jest.spyOn(component, 'addControl');
			component.formArray = fb.array<CustomFormControl>([]);
			component.addControl('valid');
			component.addControl('valid');
			component.addControl('valid');
			component.addControl('valid');
			component.addControl('valid');
			expect(spy).toHaveBeenCalled();
			expect(component.formArray.value).toHaveLength(5);
		});

		it('should prevent the adding of additional controls, when the previous one is empty', () => {
			component.formArray = fb.array<CustomFormControl>([]);
			component.addControl('valid');
			component.addControl();
			component.addControl();
			expect(component.formArray.value).toHaveLength(2);
		});
	});

	describe('removeControl', () => {
		it('should remove the UN number control from the form array at the index specified', () => {
			const methodSpy = jest.spyOn(component, 'removeControl');

			component.formArray.patchValue(['valid']); // ensure initial is valid to allow adding subsequent controls
			component.addControl('valid');
			component.addControl('valid');
			component.addControl('valid');
			component.addControl('valid');

			component.removeControl(3);
			component.removeControl(2);

			expect(methodSpy).toHaveBeenCalledTimes(2);
			expect(component.formArray.controls.at(4)).toBeUndefined();
			expect(component.formArray.controls.at(3)).toBeUndefined();
			expect(component.formArray.controls.at(2)).toBeDefined();
			expect(component.formArray.controls).toHaveLength(3);
		});
	});
});
