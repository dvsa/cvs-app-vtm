import { Modes } from '@/src/app/models/modes.enum';
import { AxlesService } from '@/src/app/services/axles/axles.service';
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
import { WeightsComponent } from '@forms/custom-sections-v2/weights/weights.component';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { updateBrakeForces } from '@store/technical-records';
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
		formGroupDirective.form = new FormGroup({
			techRecord_axles: new FormControl([]),
			techRecord_grossGbWeight: new FormControl(),
			techRecord_grossEecWeight: new FormControl(),
			techRecord_grossDesignWeight: new FormControl(),
			techRecord_unladenWeight: new FormControl(),
			techRecord_grossKerbWeight: new FormControl(),
			techRecord_grossLadenWeight: new FormControl(),
			techRecord_trainGbWeight: new FormControl(),
			techRecord_trainEecWeight: new FormControl(),
			techRecord_trainDesignWeight: new FormControl(),
			techRecord_maxTrainGbWeight: new FormControl(),
			techRecord_maxTrainEecWeight: new FormControl(),
			techRecord_maxTrainDesignWeight: new FormControl(),
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
				AxlesService,
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(WeightsComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('mode', Modes.EDIT);
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const parentFormSpy = vi.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();

			expect(parentFormSpy).toHaveBeenCalled();
		});

		it('should listen for changes to the gross kerb weight, and gross laden weight', () => {
			const handleGrossKerbWeightChangeSpy = vi.spyOn(component, 'handleGrossKerbWeightChange');
			const handleGrossLadenWeightChangeSpy = vi.spyOn(component, 'handleGrossLadenWeightChange');
			component.ngOnInit();

			expect(handleGrossKerbWeightChangeSpy).toHaveBeenCalled();
			expect(handleGrossLadenWeightChangeSpy).toHaveBeenCalled();
		});
	});

	describe('ngOnDestroy', () => {
		it('should detach its form from its parent form', () => {
			const spy = vi.spyOn(controlContainer.control as FormGroup, 'removeControl');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('shouldDisplayFormControl', () => {
		it('should return true if the form control exists on the form', () => {
			const formSpy = vi.spyOn(component.form, 'get');
			const returnValue = component.shouldDisplayFormControl('techRecord_grossGbWeight');
			expect(formSpy).toHaveBeenCalled();
			expect(returnValue).toEqual(true);
		});

		it('should return false if the form control does not exists on the form', () => {
			const formSpy = vi.spyOn(component.form, 'get');
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
			const removeAxleSpy = vi.spyOn(component.axlesService, 'removeAxle').mockImplementation();

			component.removeAxle(2);

			expect(removeAxleSpy).toHaveBeenCalled();
		});
	});

	describe('handleGrossKerbWeightChange', () => {
		it('should calculate brake forces on the first kerb weight change from a blank record', () => {
			fixture.componentRef.setInput('mode', Modes.EDIT);
			fixture.componentRef.setInput('techRecord', { techRecord_vehicleType: 'psv' });
			const updateBrakeForcesSpy = vi.spyOn(store, 'dispatch');
			component.ngOnInit();
			component.form.get('techRecord_grossKerbWeight')?.setValue(8000);

			expect(updateBrakeForcesSpy).toHaveBeenCalledExactlyOnceWith(
				updateBrakeForces({ grossKerbWeight: 8000, grossLadenWeight: null })
			);
		});
	});

	describe('handleGrossLadenWeightChange', () => {
		it('should calculate brake forces on the first laden weight change from a blank record', () => {
			fixture.componentRef.setInput('mode', Modes.EDIT);
			fixture.componentRef.setInput('techRecord', { techRecord_vehicleType: 'psv' });
			const updateBrakeForcesSpy = vi.spyOn(store, 'dispatch');
			component.ngOnInit();
			component.form.get('techRecord_grossLadenWeight')?.setValue(12000);

			expect(updateBrakeForcesSpy).toHaveBeenCalledExactlyOnceWith(
				updateBrakeForces({ grossKerbWeight: null, grossLadenWeight: 12000 })
			);
		});
	});

	describe('PSV weight changes', () => {
		it.each([
			['techRecord_grossKerbWeight', 9000, { grossKerbWeight: 9000, grossLadenWeight: 12000 }],
			['techRecord_grossLadenWeight', 13000, { grossKerbWeight: 8000, grossLadenWeight: 13000 }],
		] as const)('should ignore prepopulation but process the first edit to %s', (field, value, weights) => {
			componentRef.setInput('techRecord', {
				techRecord_vehicleType: 'psv',
				techRecord_grossKerbWeight: 8000,
				techRecord_grossLadenWeight: 12000,
			});
			const dispatchSpy = vi.spyOn(store, 'dispatch');

			component.ngOnInit();
			expect(dispatchSpy).not.toHaveBeenCalled();

			component.form.get(field)?.setValue(value);
			expect(dispatchSpy).toHaveBeenCalledExactlyOnceWith(updateBrakeForces(weights));
		});

		it.each([Modes.VIEW, Modes.SUMMARY])('should not recalculate brake forces in %s mode', (mode) => {
			componentRef.setInput('mode', mode);
			componentRef.setInput('techRecord', { techRecord_vehicleType: 'psv' });
			component.ngOnInit();
			const dispatchSpy = vi.spyOn(store, 'dispatch');

			component.form.get('techRecord_grossKerbWeight')?.setValue(8000);
			component.form.get('techRecord_grossLadenWeight')?.setValue(12000);

			expect(dispatchSpy).not.toHaveBeenCalled();
		});
	});

	describe('calculateGrossLadenWeight', () => {
		it('should return the gross laden weight, based on the gross kerb weight and the standing capacity', () => {
			const seatsUpperDeck = 22;
			const seatsLowerDeck = 22;
			const standingCapacity = 22;
			const manufactureYear = 1988;
			const grossKerbWeight = 100;

			component.form.patchValue({
				techRecord_seatsUpperDeck: seatsUpperDeck,
				techRecord_seatsLowerDeck: seatsLowerDeck,
				techRecord_manufactureYear: manufactureYear,
				techRecord_grossKerbWeight: grossKerbWeight,
				techRecord_standingCapacity: standingCapacity,
			});

			expect(component.calculateGrossLadenWeight()).toEqual(65);
		});
	});
});
