import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { NumberInputComponent } from '../../../components/number-input/number-input.component';
import { WeightsComponent } from '../weights.component';

describe('WeightsComponent', () => {
	let component: WeightsComponent;
	let fixture: ComponentFixture<WeightsComponent>;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NumberInputComponent, WeightsComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore<State>({ initialState: initialAppState }),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(WeightsComponent);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		const techRecord = mockVehicleTechnicalRecord('trl') as TechRecordType<'trl'>;
		fixture.componentRef.setInput('vehicleTechRecord', techRecord);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('calculateGrossLadenWeight', () => {
		it('should calculate the gross laden weight correctly for PSV vehicles made before 1988', () => {
			const techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;
			techRecord.techRecord_seatsUpperDeck = 10;
			techRecord.techRecord_seatsLowerDeck = 10;
			techRecord.techRecord_manufactureYear = 1987;
			techRecord.techRecord_standingCapacity = 10;
			techRecord.techRecord_grossKerbWeight = 1000;
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			expect(component.calculateGrossLadenWeight()).toBe(2969);
		});

		it('should calculate the gross laden weight correctly for PSV vehicles made during/after 1988', () => {
			const techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;
			techRecord.techRecord_seatsUpperDeck = 10;
			techRecord.techRecord_seatsLowerDeck = 10;
			techRecord.techRecord_manufactureYear = 1988;
			techRecord.techRecord_standingCapacity = 10;
			techRecord.techRecord_grossKerbWeight = 1000;
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			expect(component.calculateGrossLadenWeight()).toBe(3015);
		});
	});

	describe('getAxleForm', () => {
		it('should return the axle form group for the axle at the specified index', () => {
			component.addAxle();
			component.addAxle();

			expect(component.getAxleForm(0)).toBeDefined();
		});
	});

	describe('addAxle', () => {
		it('should dispatch the addAxle action if the tech record has less than 10 axles associated with it', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;
			techRecord.techRecord_noOfAxles = 9;
			techRecord.techRecord_axles = new Array(9).fill({});
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			component.addAxle();
			expect(dispatchSpy).toHaveBeenCalledWith({
				type: '[Technical Record Service] addAxle',
			});
		});

		it('should set isError to true, and errorMessage to a suitable string, if adding would result in more than 10 axles', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;
			techRecord.techRecord_noOfAxles = 10;
			techRecord.techRecord_axles = new Array(10).fill({});
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			component.addAxle();
			expect(dispatchSpy).toHaveBeenCalledTimes(0);
			expect(component.isError).toBe(true);
			expect(component.errorMessage).toBe('Cannot have more than 10 axles');
		});
	});

	describe('removeAxle', () => {
		it('should dispatch the remove axle action if the vehicle is a TRL with more than 1 axle', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const techRecord = mockVehicleTechnicalRecord('trl') as TechRecordType<'trl'>;
			techRecord.techRecord_noOfAxles = 2;
			techRecord.techRecord_axles = new Array(2).fill({});
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			component.removeAxle(1);
			expect(dispatchSpy).toHaveBeenCalledWith({
				index: 1,
				type: '[Technical Record Service] removeAxle',
			});
		});

		it('should dispatch the remove axle action if the vehicle is not a TRL, but has more than 2 axles', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;
			techRecord.techRecord_noOfAxles = 3;
			techRecord.techRecord_axles = new Array(3).fill({});
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			component.removeAxle(1);
			expect(dispatchSpy).toHaveBeenCalledWith({
				index: 1,
				type: '[Technical Record Service] removeAxle',
			});
		});

		it('should set isError to true and display an appropriate error message if the vehicle is a TRL and has 1 or fewer axles', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const techRecord = mockVehicleTechnicalRecord('trl') as TechRecordType<'trl'>;
			techRecord.techRecord_noOfAxles = 1;
			techRecord.techRecord_axles = new Array(1).fill({});
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			component.removeAxle(0);
			expect(dispatchSpy).toHaveBeenCalledTimes(0);
			expect(component.isError).toBe(true);
			expect(component.errorMessage).toBe('Cannot have less than 1 axles');
		});

		it('should set isError to true and display an appropriate error message if the vehicle is not a TRL and has 2 or fewer axles', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;
			techRecord.techRecord_noOfAxles = 2;
			techRecord.techRecord_axles = new Array(2).fill({});
			fixture.componentRef.setInput('vehicleTechRecord', techRecord);
			component.ngOnInit();

			component.removeAxle(1);
			expect(dispatchSpy).toHaveBeenCalledTimes(0);
			expect(component.isError).toBe(true);
			expect(component.errorMessage).toBe('Cannot have less than 2 axles');
		});
	});
});
