import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { WeightsComponent } from '@forms/custom-sections-v2/weights/weights.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('WeightsComponent', () => {
	let store: MockStore;
	let component: WeightsComponent;
	let componentRef: ComponentRef<WeightsComponent>;
	let fixture: ComponentFixture<WeightsComponent>;
	let controlContainer: ControlContainer;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl'>, FormControl>>>({
			techRecord_axles: new FormControl([]),
			techRecord_grossGbWeight: new FormControl(),
		});
		const mockTechRecord = { ...mockVehicleTechnicalRecord('hgv'), techRecord_axles: [] };

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, WeightsComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(WeightsComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const parentFormSpy = jest.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();

			expect(parentFormSpy).toHaveBeenCalled();
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from all subscriptions', () => {
			const spy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});

		it('should detach its form from its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'removeControl');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('shouldDisplayFormControl', () => {
		it('should return true if the form control exists on the form', () => {
			const formSpy = jest.spyOn(component.form, 'get');
			const returnValue = component.shouldDisplayFormControl('techRecord_grossGbWeight');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(true);
		});

		it('should return false if the form control does not exists on the form', () => {
			const formSpy = jest.spyOn(component.form, 'get');
			const returnValue = component.shouldDisplayFormControl('techRecord_reasonForCreation');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(false);
		});
	});

	describe('showAddAxleButton', () => {
		it('should return true if the noOfAxles is less than 10', () => {
			component.techRecord().techRecord_noOfAxles = 5;
			const returnValue = component.showAddAxleButton();
			expect(returnValue).toEqual(true);
		});

		it('should return false if the noOfAxles is 10 or more', () => {
			component.techRecord().techRecord_noOfAxles = 10;
			const returnValue = component.showAddAxleButton();
			expect(returnValue).toEqual(false);

			component.techRecord().techRecord_noOfAxles = 15;
			const returnValue2 = component.showAddAxleButton();
			expect(returnValue2).toEqual(false);
		});
	});

	describe('removeAxle', () => {
		it('should call the removeAxle function from the axlesService', () => {
			const removeAxleSpy = jest.spyOn(component.axlesService, 'removeAxle').mockImplementation();

			component.removeAxle(2);

			expect(removeAxleSpy).toHaveBeenCalled();
		});

		it('should set showDimensionsWarning to true so it can display the warning message', () => {
			component.showDimensionsWarning = false;

			component.removeAxle(2);

			expect(component.showDimensionsWarning).toBe(true);
		});
	});
});
