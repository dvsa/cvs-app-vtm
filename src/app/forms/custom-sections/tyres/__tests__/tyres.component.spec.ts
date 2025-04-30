import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { Axles, Tyres } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State, initialAppState } from '@store/index';
import { of, throwError } from 'rxjs';
import { TyresComponent } from '../tyres.component';

const mockReferenceDataService = {
	fetchReferenceDataByKey: jest.fn(),
	loadReferenceData: jest.fn(),
	getAll$: jest.fn().mockReturnValue(of([])),
};

const mockTechRecordService = {
	getAxleFittingWeightValueFromLoadIndex: jest.fn(),
};

describe('TyresComponent', () => {
	let component: TyresComponent;
	let fixture: ComponentFixture<TyresComponent>;
	let spy: jest.SpyInstance<void, [tyre: Tyres, axleNumber: number]>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TyresComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore<State>({ initialState: initialAppState }),
				{ provide: ReferenceDataService, useValue: mockReferenceDataService },
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TyresComponent);
		component = fixture.componentInstance;
		const techRecord = mockVehicleTechnicalRecord('psv');
		techRecord.techRecord_axles = [
			{
				axleNumber: 1,
				tyres_tyreSize: '295/80-22.5',
				tyres_speedCategorySymbol: 'p',
				tyres_fitmentCode: 'double',
				tyres_dataTrAxles: 0,
				tyres_plyRating: 'A',
				tyres_tyreCode: 456,
				parkingBrakeMrk: false,

				weights_kerbWeight: 1,
				weights_ladenWeight: 2,
				weights_gbWeight: 3,
				// TODO: V3 2 eecweights in type package, which is this?
				// weights_eecWeight: 4,
				weights_designWeight: 5,
			},
			{
				axleNumber: 2,
				parkingBrakeMrk: true,

				tyres_tyreSize: '295/80-22.5',
				tyres_speedCategorySymbol: 'p',
				tyres_fitmentCode: 'double',
				tyres_dataTrAxles: 0,
				tyres_plyRating: 'A',
				tyres_tyreCode: 456,

				weights_kerbWeight: 1,
				weights_ladenWeight: 2,
				weights_gbWeight: 3,
				// weights_eecWeight: 4,
				weights_designWeight: 5,
			},
			{
				axleNumber: 3,
				parkingBrakeMrk: true,

				tyres_tyreSize: '295/80-22.5',
				tyres_speedCategorySymbol: 'p',
				tyres_fitmentCode: 'double',
				tyres_dataTrAxles: 0,
				tyres_plyRating: 'A',
				tyres_tyreCode: 456,

				weights_kerbWeight: 1,
				weights_ladenWeight: 2,
				weights_gbWeight: 3,
				// weights_eecWeight: 4,
				weights_designWeight: 5,
			},
		];
		fixture.componentRef.setInput('vehicleTechRecord', techRecord);
		fixture.detectChanges();
		spy = jest.spyOn(component, 'addTyreToTechRecord');
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('checkAxleWeights', () => {
		const currentAxle = [
			{
				weights_gbWeight: 1650,
				axleNumber: 1,
				tyres_dataTrAxles: 100,
				tyres_fitmentCode: 'single',
				tyres_tyreCode: '123',
			},
		];
		const previousAxle = [
			{
				weights_gbWeight: 1649,
				axleNumber: 1,
				tyres_dataTrAxles: 100,
				tyres_fitmentCode: 'single',
				tyres_tyreCode: '123',
			},
		];
		let simpleChanges: SimpleChanges;
		beforeEach(() => {
			simpleChanges = {
				vehicleTechRecord: {
					currentValue: { techRecord_axles: currentAxle },
					previousValue: { techRecord_axles: previousAxle },
					firstChange: false,
				},
			} as unknown as SimpleChanges;
			fixture.componentRef.setInput('isEditing', true);
		});
		it('should return if isEditing is false', () => {
			fixture.componentRef.setInput('isEditing', false);
			component.checkAxleWeights(simpleChanges);
			expect(mockTechRecordService.getAxleFittingWeightValueFromLoadIndex).not.toHaveBeenCalled();
		});
		it('should call getAxleFittingWeightValueFromLoadIndex', () => {
			component.checkAxleWeights(simpleChanges);
			expect(mockTechRecordService.getAxleFittingWeightValueFromLoadIndex).toHaveBeenCalled();
		});
		it('should add an invalid axle to the invalidAxles array', () => {
			mockTechRecordService.getAxleFittingWeightValueFromLoadIndex.mockReturnValue(1649);
			component.checkAxleWeights(simpleChanges);
			expect(component.invalidAxles).toContain(currentAxle[0].axleNumber);
		});
		it('should not add a valid axle to the invalidAxles array', () => {
			mockTechRecordService.getAxleFittingWeightValueFromLoadIndex.mockReturnValue(1651);
			component.checkAxleWeights(simpleChanges);
			expect(component.invalidAxles).not.toContain(currentAxle[0].axleNumber);
		});
	});
	// TODO V3 PSV
	describe('checkFitmentCodeHasChanged', () => {
		it('should return false when there has been no change', () => {
			const currentAxle = [{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' }];
			const previousAxle = [{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' }];

			const simpleChanges = {
				vehicleTechRecord: {
					currentValue: { techRecord_axles: currentAxle },
					previousValue: { techRecord_axles: previousAxle },
					firstChange: false,
				},
			};

			expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
		});

		it('should return true when there has been a change', () => {
			jest.spyOn(component, 'getTyresRefData').mockImplementation(() => null);
			const currentAxle = [{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' }];
			const previousAxle = [{ tyres_fitmentCode: 'double', tyres_tyreCode: '123' }];

			const simpleChanges = {
				vehicleTechRecord: {
					currentValue: { techRecord_axles: currentAxle },
					previousValue: { techRecord_axles: previousAxle },
					firstChange: false,
				},
			};

			expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(true);
		});

		it('should return false when there has been no change with multiple objects', () => {
			const currentAxle = [
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
			];
			const previousAxle = [
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
			];

			const simpleChanges = {
				vehicleTechRecord: {
					currentValue: { techRecord_axles: currentAxle },
					previousValue: { techRecord_axles: previousAxle },
					firstChange: false,
				},
			};

			expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
		});

		it('should return true when there has been a change with multiple objects', () => {
			jest.spyOn(component, 'getTyresRefData').mockImplementation(() => null);
			const currentAxle = [
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
			];
			const previousAxle = [
				{ tyres_fitmentCode: 'double', tyres_tyreCode: '123' },
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
			];

			const simpleChanges = {
				vehicleTechRecord: {
					currentValue: { techRecord_axles: currentAxle },
					previousValue: { techRecord_axles: previousAxle },
					firstChange: false,
				},
			};

			expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(true);
		});

		it('should return false when this is a first change', () => {
			const currentAxle = [
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
			];
			const previousAxle = [
				{ tyres_fitmentCode: 'double', tyres_tyreCode: '123' },
				{ tyres_fitmentCode: 'single', tyres_tyreCode: '123' },
			];

			const simpleChanges = {
				vehicleTechRecord: {
					currentValue: { techRecord_axles: currentAxle },
					previousValue: { techRecord_axles: previousAxle },
					firstChange: true,
				},
			};

			expect(component.checkFitmentCodeHasChanged(simpleChanges as unknown as SimpleChanges)).toBe(false);
		});
	});

	describe('getTyresRefData', () => {
		it('should call add tyre to tech record with correct values', () => {
			mockReferenceDataService.fetchReferenceDataByKey.mockImplementationOnce(() => {
				return of({
					code: '101',
					loadIndexSingleLoad: '123',
					tyreSize: '123L:123',
					dateTimeStamp: 'date',
					userId: 'user',
					loadIndexTwinLoad: '126',
					plyRating: '12',
				});
			});
			component.getTyresRefData(1);

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should call add tyre to tech record with correct values when failure', () => {
			mockReferenceDataService.fetchReferenceDataByKey.mockReturnValue(throwError(() => 'error'));

			component.getTyresRefData(1);

			expect(component.isError).toBe(true);
			expect(component.errorMessage).toBe('Cannot find data of this tyre on axle 1');
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('addTyreToTechRecord', () => {
		it('should update the tech record with the new tyre', () => {
			const tyre = {
				tyreSize: '123',
				dataTrAxles: 123,
				plyRating: '12',
				tyreCode: 101,
			};

			component.addTyreToTechRecord(tyre, 1);

			const axles = component.vehicleTechRecord().techRecord_axles as Axles;

			expect(axles[0]?.tyres_tyreSize).toBe(tyre.tyreSize);
			expect(axles[0]?.tyres_dataTrAxles).toBe(tyre.dataTrAxles);
			expect(axles[0]?.tyres_plyRating).toBe(tyre.plyRating);
			expect(axles[0]?.tyres_tyreCode).toBe(tyre.tyreCode);
		});
	});
});
