import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
	TechRecordGETHGV,
	TechRecordGETPSV,
	TechRecordGETTRL,
	TechRecordType as TechRecordTypeVehicle,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { ReferenceDataResourceType, ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { AxleTyreProperties } from '@models/vehicle/axleTyreProperties';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { State, initialAppState } from '@store/index';
import { updateEditingTechRecord } from '@store/technical-records';
import { EmptyError, firstValueFrom, from, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TechnicalRecordService } from '../technical-record.service';

describe('TechnicalRecordService', () => {
	let service: TechnicalRecordService;
	let httpClient: HttpTestingController;
	let store: MockStore<State>;
	let httpService: HttpService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [TechnicalRecordService, provideMockStore({ initialState: initialAppState })],
		});
		httpClient = TestBed.inject(HttpTestingController);
		service = TestBed.inject(TechnicalRecordService);
		store = TestBed.inject(MockStore);
		httpService = TestBed.inject(HttpService);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpClient.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('isUnique', () => {
		it('should validate the search term to be unique when no matching results are returned (Test Case 1)', () => {
			const searchParams = { searchTerm: '12345', type: 'vin' };
			const mockData = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel;

			service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe((response) => {
				expect(response).toBe(true);
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpClient.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`
			);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(mockData);
		});

		it('should validate the search term to be unique when no matching results are returned (Test Case 2)', () => {
			const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
			const mockData = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel;

			service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe((response) => {
				expect(response).toBe(true);
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpClient.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`
			);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(mockData);
		});

		it('should validate the search term to be non unique when matching results are returned and are current or provisional', () => {
			const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
			const mockData = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel;

			service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe((response) => {
				expect(response).toBe(false);
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpClient.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`
			);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(mockData);
		});

		it('should validate the search term to be non unique when vrm is used as a primary', () => {
			const searchParams = { searchTerm: 'KP01 ABC', type: 'vrm' };
			const mockData = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel;

			service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VRM).subscribe((response) => {
				expect(response).toBe(false);
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpClient.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=primaryVrm`
			);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(mockData);
		});

		it('should validate the search term to be unique when vrm is not used as a primary', () => {
			const searchParams = { searchTerm: '12345', type: 'vrm' };
			const mockData = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel;

			service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VRM).subscribe((response) => {
				expect(response).toBe(true);
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpClient.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=primaryVrm`
			);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(mockData);
		});
	});

	describe('getVehicleMakeAndModel', () => {
		it('should return an empty string if there is no make and model', () => {
			const record = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
			} as unknown as TechRecordType<'put'>;
			expect(service.getMakeAndModel(record)).toBe('');
		});
		it('for a PSV returns the chassis make and model', () => {
			const record: V3TechRecordModel = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.PSV,
				techRecord_chassisMake: 'test chassis make',
				techRecord_chassisModel: 'chassis model',
			} as unknown as V3TechRecordModel;
			expect(service.getMakeAndModel(record)).toBe('test chassis make - chassis model');
		});
		it('for a any other type returns make and model', () => {
			const record: V3TechRecordModel = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.HGV,
				techRecord_make: 'make',
				techRecord_model: 'model',
			} as unknown as V3TechRecordModel;
			expect(service.getMakeAndModel(record)).toBe('make - model');
		});
	});

	describe('business logic methods', () => {
		describe('updateEditingTechRecord', () => {
			it(`should patch the missing information for the technical
      record and dispatch the action to update the editing vehicle
      record with the full vehicle record`, () => {
				const dispatchSpy = jest.spyOn(store, 'dispatch');
				const mockVehicleRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as unknown as TechRecordType<'put'>;

				service.updateEditingTechRecord(mockVehicleRecord);
				expect(dispatchSpy).toHaveBeenCalledTimes(1);
				expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
			});

			it(`should patch from the selected record if the editing is
      not defined and dispatch the action to update the editing
      vehicle record with the full vehicle record`, () => {
				const dispatchSpy = jest.spyOn(store, 'dispatch');
				const mockVehicleRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as unknown as TechRecordType<'put'>;

				service.updateEditingTechRecord(mockVehicleRecord);
				expect(dispatchSpy).toHaveBeenCalledTimes(1);
				expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
			});

			it('should update the number of axles based on the axles array', () => {
				const dispatchSpy = jest.spyOn(store, 'dispatch');
				const mockVehicleRecord = mockVehicleTechnicalRecord('trl');
				mockVehicleRecord.techRecord_noOfAxles = 0;
				mockVehicleRecord.techRecord_axles = [{}, {}];

				service.updateEditingTechRecord(mockVehicleRecord as TechRecordType<'put'>);

				expect(dispatchSpy).toHaveBeenCalledWith(
					updateEditingTechRecord({
						vehicleTechRecord: {
							...mockVehicleRecord,
							techRecord_axles: [{}, {}],
							techRecord_noOfAxles: 2,
						} as TechRecordType<'put'>,
					})
				);
			});

			it('override the editable tech record and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
				const dispatchSpy = jest.spyOn(store, 'dispatch');
				const mockVehicleRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as unknown as TechRecordType<'put'>;

				const mockEditableVehicleRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'a random vin',
				} as unknown as TechRecordType<'put'>;

				service.updateEditingTechRecord(mockVehicleRecord);
				expect(dispatchSpy).toHaveBeenCalledTimes(1);
				expect(dispatchSpy).not.toHaveBeenCalledWith(
					updateEditingTechRecord({ vehicleTechRecord: mockEditableVehicleRecord })
				);
				expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
			});

			it('should throw an error if there is more than one tech record', () => {
				const dispatchSpy = jest.spyOn(store, 'dispatch');
				const mockVehicleRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as unknown as TechRecordType<'put'>;
				service.updateEditingTechRecord(mockVehicleRecord);
				expect(dispatchSpy).toHaveBeenCalledTimes(1);
				expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
			});
		});
	});

	describe('getMakeAndModel', () => {
		it('should should return the make and model', () => {
			expect(service.getMakeAndModel({ techRecord_make: 'Test', techRecord_model: 'Car' } as V3TechRecordModel)).toBe(
				'Test - Car'
			);
		});

		it('should return an empty string when the current record has no values for make and model', () => {
			expect(
				service.getMakeAndModel({ techRecord_make: undefined, techRecord_model: undefined } as V3TechRecordModel)
			).toBe('');
		});
	});

	describe('haveAxlesChanged', () => {
		it('should return true if a property of the hgv gross axle has changed', () => {
			const vehicleType = VehicleTypes.HGV;
			const changes = {
				techRecord_grossDesignWeight: 1,
				techRecord_grossEecWeight: 2,
				techRecord_grossGbWeight: 3,
			} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvGrossAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the hgv gross axle have changed', () => {
			const vehicleType = VehicleTypes.HGV;
			const changes = {} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvGrossAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});

		it('should return true if a property of the psv gross axle has changed', () => {
			const vehicleType = VehicleTypes.PSV;
			const changes = {
				techRecord_grossKerbWeight: 1,
				techRecord_grossLadenWeight: 1,
				techRecord_grossDesignWeight: 1,
				techRecord_grossGbWeight: 1,
			} as Partial<TechRecordGETPSV>;

			const spy = jest.spyOn(service, 'hasPsvGrossAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the psv gross axle have changed', () => {
			const vehicleType = VehicleTypes.PSV;
			const changes = {} as Partial<TechRecordGETPSV>;
			const spy = jest.spyOn(service, 'hasPsvGrossAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});

		it('should return true if a property of the trl gross axle has changed', () => {
			const vehicleType = VehicleTypes.TRL;
			const changes = {
				techRecord_grossDesignWeight: 1,
				techRecord_grossEecWeight: 2,
				techRecord_grossGbWeight: 3,
			} as Partial<TechRecordGETTRL>;
			const spy = jest.spyOn(service, 'hasTrlGrossAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the trl gross axle have changed', () => {
			const vehicleType = VehicleTypes.TRL;
			const changes = {} as Partial<TechRecordGETTRL>;
			const spy = jest.spyOn(service, 'hasTrlGrossAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});

		it('should return true if a property of the max train axle has changed', () => {
			const vehicleType = VehicleTypes.HGV;
			const changes = {
				techRecord_maxTrainDesignWeight: 5,
				techRecord_maxTrainEecWeight: 3,
				techRecord_maxTrainGbWeight: 3,
			} as Partial<TechRecordGETHGV>;

			const spy = jest.spyOn(service, 'hasMaxTrainAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});
		it('should return true if a property of the hgv train axle has changed', () => {
			const vehicleType = VehicleTypes.HGV;
			const changes = {
				techRecord_trainDesignWeight: 1,
				techRecord_trainEecWeight: 2,
				techRecord_trainGbWeight: 3,
			} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvTrainAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the hgv train axle have changed', () => {
			const vehicleType = VehicleTypes.HGV;
			const changes = {} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvTrainAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});

		it('should return true if a property of the psv train axle has changed', () => {
			const vehicleType = VehicleTypes.PSV;
			const changes = {
				techRecord_trainDesignWeight: 1,
				techRecord_trainEecWeight: 2,
				techRecord_trainGbWeight: 3,
			} as Partial<TechRecordGETPSV>;
			const spy = jest.spyOn(service, 'hasPsvTrainAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the psv train axle have changed', () => {
			const vehicleType = VehicleTypes.PSV;
			const changes = {} as Partial<TechRecordGETPSV>;
			const spy = jest.spyOn(service, 'hasPsvTrainAxleChanged');
			const result = service.haveAxlesChanged(vehicleType, changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});
	});

	describe('hasPsvTrainAxleChanged', () => {
		it('should return true if a property of the psv train axle has changed', () => {
			const changes = { techRecord_trainDesignWeight: 1, techRecord_maxTrainGbWeight: 2 } as Partial<TechRecordGETPSV>;
			const spy = jest.spyOn(service, 'hasPsvTrainAxleChanged');
			const result = service.hasPsvTrainAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the psv train axle have changed', () => {
			const changes = {} as Partial<TechRecordGETPSV>;
			const spy = jest.spyOn(service, 'hasPsvTrainAxleChanged');
			const result = service.hasPsvTrainAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});
	});

	describe('hasHgvTrainAxleChanged', () => {
		it('should return true if a property of the hgv train axle has changed', () => {
			const changes = { techRecord_trainDesignWeight: 1, techRecord_maxTrainGbWeight: 2 } as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvTrainAxleChanged');
			const result = service.hasHgvTrainAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the hgv train axle have changed', () => {
			const changes = {} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvTrainAxleChanged');
			const result = service.hasHgvTrainAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});
	});

	describe('hasTrlGrossAxleChanged', () => {
		it('should return true if a property of the trl gross axle has changed', () => {
			const changes = {
				techRecord_grossDesignWeight: 1,
				techRecord_grossEecWeight: 2,
				techRecord_grossGbWeight: 3,
			} as Partial<TechRecordGETTRL>;
			const spy = jest.spyOn(service, 'hasTrlGrossAxleChanged');
			const result = service.hasTrlGrossAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the trl gross axle have changed', () => {
			const changes = {} as Partial<TechRecordGETTRL>;
			const spy = jest.spyOn(service, 'hasTrlGrossAxleChanged');
			const result = service.hasTrlGrossAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});
	});

	describe('hasHgvGrossAxleChanged', () => {
		it('should return true if a property of the hgv gross axle has changed', () => {
			const changes = {
				techRecord_grossDesignWeight: 1,
				techRecord_grossEecWeight: 2,
				techRecord_grossGbWeight: 3,
			} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvGrossAxleChanged');
			const result = service.hasHgvGrossAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the hgv gross axle have changed', () => {
			const changes = {} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasHgvGrossAxleChanged');
			const result = service.hasHgvGrossAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});
	});

	describe('hasMaxTrainAxleChanged', () => {
		it('should return true if a property of the max train axle has changed', () => {
			const changes = { techRecord_trainDesignWeight: 1, techRecord_maxTrainGbWeight: 2 } as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasMaxTrainAxleChanged');
			const result = service.hasMaxTrainAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the max train axle have changed', () => {
			const changes = {} as Partial<TechRecordGETHGV>;
			const spy = jest.spyOn(service, 'hasMaxTrainAxleChanged');
			const result = service.hasMaxTrainAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});
	});

	describe('hasPsvGrossAxleChanged', () => {
		it('should return true if a property of the psv gross axle has changed', () => {
			const changes = {
				techRecord_grossDesignWeight: 1,
				techRecord_grossEecWeight: 2,
				techRecord_grossGbWeight: 3,
			} as Partial<TechRecordGETPSV>;
			const spy = jest.spyOn(service, 'hasPsvGrossAxleChanged');
			const result = service.hasPsvGrossAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(true);
		});

		it('should return false if no properties of the psv gross axle have changed', () => {
			const changes = {} as Partial<TechRecordGETPSV>;
			const spy = jest.spyOn(service, 'hasPsvGrossAxleChanged');
			const result = service.hasPsvGrossAxleChanged(changes);
			expect(spy).toHaveBeenCalledWith(changes);
			expect(result).toBe(false);
		});
	});

	describe('getAxleFittingWeightValueFromLoadIndex', () => {
		const loadIndex = '100';
		const loadIndexArray: ReferenceDataTyreLoadIndex[] = [
			{
				resourceType: ReferenceDataResourceType.Tyres,
				resourceKey: loadIndex,
				loadIndex: '825',
			},
		];
		it('should return double the loadIndex value passed in if fitment code is set to single', () => {
			const fitmentCodeType = AxleTyreProperties.FitmentCodeEnum.Single;
			const result = service.getAxleFittingWeightValueFromLoadIndex(loadIndex, fitmentCodeType, loadIndexArray);
			expect(result).toBe(1650);
		});
		it('should return quadruple the loadIndex value passed in if fitment code is set to single', () => {
			const fitmentCodeType = AxleTyreProperties.FitmentCodeEnum.Double;
			const result = service.getAxleFittingWeightValueFromLoadIndex(loadIndex, fitmentCodeType, loadIndexArray);
			expect(result).toBe(3300);
		});
	});

	describe('getVehicleTypeWithSmallTrl', () => {
		it('should return small trl when the vehicle is a TRL and has an EU vehicle category of o1 or o2', () => {
			const smallTrl1 = {
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_euVehicleCategory: EUVehicleCategory.O1,
			} as unknown as V3TechRecordModel;

			const smallTrl2 = {
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_euVehicleCategory: EUVehicleCategory.O2,
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleTypeWithSmallTrl(smallTrl1)).toEqual(VehicleTypes.SMALL_TRL);
			expect(service.getVehicleTypeWithSmallTrl(smallTrl2)).toEqual(VehicleTypes.SMALL_TRL);
		});

		it('should return the regular vehicle type when the vehicle is not a TRL', () => {
			const hgv = {
				techRecord_vehicleType: VehicleTypes.HGV,
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleTypeWithSmallTrl(hgv)).toEqual(VehicleTypes.HGV);
		});

		it('should return TRL when the vehicle is a TRL and has an EU vehicle category which is neither o1 or o2', () => {
			const trl = {
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_euVehicleCategory: EUVehicleCategory.O3,
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleTypeWithSmallTrl(trl)).toEqual(VehicleTypes.TRL);
		});
	});

	describe('generateEditingVehicleTechnicalRecordFromVehicleType', () => {
		it('should dispatch the createVehicle action with the provided vehicle type', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			service.generateEditingVehicleTechnicalRecordFromVehicleType(VehicleTypes.CAR);
			expect(dispatchSpy).toHaveBeenCalledWith({
				techRecord_vehicleType: 'car',
				type: '[Technical Record Service] createVehicle',
			});
		});
	});

	describe('validateVinForUpdate', () => {
		it('should return an async validator which displays an appropriate error message when no new VIN is provided', async () => {
			const vin = 'vin';
			const control = new FormControl('vin');
			const isUniqueSpy = jest.spyOn(service, 'isUnique').mockReturnValue(of(false));

			const validator = service.validateVinForUpdate(vin);
			await expect(firstValueFrom(from(validator(control)))).resolves.toEqual({
				validateVin: {
					message: 'You must provide a new VIN',
				},
			});

			expect(isUniqueSpy).toHaveBeenCalledWith(control.value, SEARCH_TYPES.VIN);
		});

		it('should return an async validator which returns null when the VIN provided is unique', async () => {
			const vin = 'vin';
			const control = new FormControl('new vin');
			const isUniqueSpy = jest.spyOn(service, 'isUnique').mockReturnValue(of(true));

			const validator = service.validateVinForUpdate(vin);
			await expect(firstValueFrom(from(validator(control)))).resolves.toBeNull();
			expect(isUniqueSpy).toHaveBeenCalledWith(control.value, SEARCH_TYPES.VIN);
		});

		it('should return an async validator which returns an error message when the VIN is different, but is in use', async () => {
			const vin = 'vin';
			const control = new FormControl('new vin');
			const isUniqueSpy = jest.spyOn(service, 'isUnique').mockReturnValue(of(false));

			const validator = service.validateVinForUpdate(vin);
			await expect(firstValueFrom(from(validator(control)))).resolves.toEqual({
				validateVin: { message: 'This VIN already exists, if you continue it will be associated with two vehicles' },
			});

			expect(isUniqueSpy).toHaveBeenCalledWith(control.value, SEARCH_TYPES.VIN);
		});
	});

	describe('validateVrmDoesNotExist', () => {
		beforeEach(() => {
			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(of([]));
		});

		it('should emit empty if the control has a falsy value', async () => {
			const previousVrm = 'previous vrm';
			const control = new FormControl(null);
			const checkVrmNotActiveSpy = jest.spyOn(service, 'checkVrmNotActive');

			const validator = service.validateVrmDoesNotExist(previousVrm);
			await expect(firstValueFrom(from(validator(control)))).rejects.toEqual(new EmptyError());

			expect(checkVrmNotActiveSpy).toHaveBeenCalledTimes(0);
		});

		it('should return the result of checkVrm not active when the value of the provide control is truthy', async () => {
			const previousVrm = 'previous vrm';
			const control = new FormControl('truthy value');
			const checkVrmNotActiveSpy = jest.spyOn(service, 'checkVrmNotActive');

			const validator = service.validateVrmDoesNotExist(previousVrm);
			await expect(firstValueFrom(from(validator(control)))).resolves.toBeDefined();

			expect(checkVrmNotActiveSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('validateVrmForCherishedTransfer', () => {
		beforeEach(() => {
			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(of([]));
		});

		it('should return empty is the value of the control is falsy', async () => {
			const control = new FormControl(null);
			const searchSpy = jest.spyOn(httpService, 'searchTechRecords');
			const checkVrmNotActiveSpy = jest.spyOn(service, 'checkVrmNotActive');

			const validator = service.validateVrmForCherishedTransfer();
			await expect(firstValueFrom(from(validator(control)))).rejects.toEqual(new EmptyError());

			expect(searchSpy).toHaveBeenCalledTimes(0);
			expect(checkVrmNotActiveSpy).toHaveBeenCalledTimes(0);
		});

		it('should return the result of checkVrmNotActive when the control root has no third mark', async () => {
			const form = new FormGroup({
				thirdMark: new FormControl(null),
				previousVrm: new FormControl('previous vrm'),
				control: new FormControl('current vrm'),
			});

			const searchSpy = jest.spyOn(httpService, 'searchTechRecords');
			const checkVrmNotActiveSpy = jest.spyOn(service, 'checkVrmNotActive');

			const validator = service.validateVrmForCherishedTransfer();
			await expect(firstValueFrom(from(validator(form.controls.control)))).resolves.toBeDefined();

			expect(searchSpy).toHaveBeenCalledTimes(1);
			expect(checkVrmNotActiveSpy).toHaveBeenCalledTimes(1);
		});

		it('should return null when a thirdMark is provided, and a current record exists with the previous VRM', async () => {
			const form = new FormGroup({
				thirdMark: new FormControl('third mark'),
				previousVrm: new FormControl('previous vrm'),
				control: new FormControl('current vrm'),
			});

			const checkVrmNotActiveSpy = jest.spyOn(service, 'checkVrmNotActive');
			const searchSpy = jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
				of([
					{
						primaryVrm: 'previous vrm',
						techRecord_statusCode: StatusCodes.CURRENT,
					} as TechRecordSearchSchema,
				])
			);

			const validator = service.validateVrmForCherishedTransfer();
			await expect(firstValueFrom(from(validator(form.controls.control)))).resolves.toBeNull();

			expect(searchSpy).toHaveBeenCalledTimes(1);
			expect(checkVrmNotActiveSpy).toHaveBeenCalledTimes(0);
		});

		it('should return an appropriate error message if there is a third mark, but the previous vrm does not belong to a current record', async () => {
			const form = new FormGroup({
				thirdMark: new FormControl('third mark'),
				previousVrm: new FormControl('previous vrm'),
				control: new FormControl('current vrm'),
			});

			const checkVrmNotActiveSpy = jest.spyOn(service, 'checkVrmNotActive');
			const searchSpy = jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
				of([
					{
						primaryVrm: 'previous vrm',
						techRecord_statusCode: StatusCodes.PROVISIONAL,
					} as TechRecordSearchSchema,
				])
			);

			const validator = service.validateVrmForCherishedTransfer();
			await expect(firstValueFrom(from(validator(form.controls.control)))).resolves.toEqual({
				validateVrm: {
					message: 'This VRM does not exist on a current record',
				},
			});

			expect(searchSpy).toHaveBeenCalledTimes(1);
			expect(checkVrmNotActiveSpy).toHaveBeenCalledTimes(0);
		});
	});

	describe('clearEditingTechRecord', () => {
		it('should dispatch the updateEditingTechRecordCancel action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			service.clearEditingTechRecord();
			expect(dispatchSpy).toHaveBeenCalledWith({
				type: '[Technical Record Service] updateEditingTechRecordCancel',
			});
		});
	});

	describe('clearSectionTemplateStates', () => {
		it('should dispatch the clearAllSectionStates action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			service.clearSectionTemplateStates();
			expect(dispatchSpy).toHaveBeenCalledWith({
				type: '[Technical Record Service] clearAllSectionState',
			});
		});
	});

	describe('checkVrmNotActive', () => {
		beforeEach(() => {
			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(of([]));
		});

		it('should not display an appropriate error message when the provided VRM is the same as the current', async () => {
			const vrm = 'vrm';
			const control = new FormControl(vrm);
			const spy = jest.spyOn(httpService, 'searchTechRecords');

			await expect(firstValueFrom(service.checkVrmNotActive(control, vrm))).resolves.toEqual({
				validateVrm: { message: 'You must provide a new VRM' },
			});

			expect(spy).toHaveBeenCalledWith(SEARCH_TYPES.VRM, vrm);
		});

		it('should determine if the VRM is being used by a current tech record, and display an appropriate message', async () => {
			const vrm = 'vrm';
			const control = new FormControl('new vrm');
			const spy = jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
				of([
					{
						primaryVrm: 'new vrm',
						vin: 'vin',
						techRecord_statusCode: StatusCodes.CURRENT,
					} as unknown as TechRecordSearchSchema,
				])
			);

			await expect(firstValueFrom(service.checkVrmNotActive(control, vrm))).resolves.toEqual({
				validateVrm: {
					message: `A current technical record already exists for
              new vrm with the VIN number vin.
              Please fill in the third mark field`,
				},
			});

			expect(spy).toHaveBeenCalledWith(SEARCH_TYPES.VRM, 'new vrm');
		});

		it('should determine if the VRM is being used by a provisional tech record, and display an appropriate message', async () => {
			const vrm = 'vrm';
			const control = new FormControl('new vrm');
			const spy = jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
				of([
					{
						primaryVrm: 'new vrm',
						vin: 'vin',
						techRecord_statusCode: StatusCodes.PROVISIONAL,
					} as unknown as TechRecordSearchSchema,
				])
			);

			await expect(firstValueFrom(service.checkVrmNotActive(control, vrm))).resolves.toEqual({
				validateVrm: {
					message: 'This VRM already exists on a provisional record with the VIN: vin',
				},
			});

			expect(spy).toHaveBeenCalledWith(SEARCH_TYPES.VRM, 'new vrm');
		});

		it('should return null when the VRM is not being used by a current or provisional record', async () => {
			const vrm = 'vrm';
			const control = new FormControl('new vrm');
			const spy = jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(of([]));

			await expect(firstValueFrom(service.checkVrmNotActive(control, vrm))).resolves.toBeNull();

			expect(spy).toHaveBeenCalledWith(SEARCH_TYPES.VRM, 'new vrm');
		});
	});

	describe('getVehicleSize', () => {
		it('should return the vehicle size of the provided tech record, if the vehicle type is a PSV', () => {
			const techRecord = {
				techRecord_vehicleType: VehicleTypes.PSV,
				techRecord_bodyType: 'body type',
				techRecord_seatsLowerDeck: 10,
				techRecord_seatsUpperDeck: 12,
				techRecord_vehicleSize: 22,
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleSize(techRecord)).toBe(22);
		});

		it('should return undefined when the provided tech record is not a PSV', () => {
			const techRecord = {
				techRecord_vehicleType: VehicleTypes.HGV,
				techRecord_bodyType: 'body type',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleSize(techRecord)).toBeUndefined();
		});
	});

	describe('getVehicleClassDescription', () => {
		it('should return the vehicle class description for PSV, HGV, TRL and Motorcycles', () => {
			const psv = {
				techRecord_vehicleType: VehicleTypes.PSV,
				techRecord_bodyType: 'body type',
				techRecord_seatsLowerDeck: 10,
				techRecord_seatsUpperDeck: 12,
				techRecord_vehicleSize: 22,
				techRecord_vehicleClass_description: 'vehicle class description',
			} as unknown as V3TechRecordModel;

			const hgv = {
				techRecord_vehicleType: VehicleTypes.HGV,
				techRecord_bodyType: 'body type',
				techRecord_vehicleClass_description: 'vehicle class description',
			} as unknown as V3TechRecordModel;

			const trl = {
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_bodyType: 'body type',
				techRecord_vehicleClass_description: 'vehicle class description',
			} as unknown as V3TechRecordModel;

			const motorcycle = {
				techRecord_vehicleType: VehicleTypes.MOTORCYCLE,
				techRecord_bodyType: 'body type',
				techRecord_vehicleClass_description: 'vehicle class description',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClassDescription(psv)).toBe('vehicle class description');
			expect(service.getVehicleClassDescription(hgv)).toBe('vehicle class description');
			expect(service.getVehicleClassDescription(trl)).toBe('vehicle class description');
			expect(service.getVehicleClassDescription(motorcycle)).toBe('vehicle class description');
		});

		it('should return undefined when the vehicle type is not PSV, HGV, TRL or Motorcycle', () => {
			const car = {
				techRecord_vehicleType: VehicleTypes.CAR,
				techRecord_bodyType: 'body type',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClassDescription(car)).toBeUndefined();
		});
	});

	describe('getVehicleClassCode', () => {
		it('should return the vehicle class code for complete motorcycles', () => {
			const motorcycle = {
				techRecord_vehicleType: VehicleTypes.MOTORCYCLE,
				techRecord_bodyType: 'body type',
				techRecord_recordCompleteness: 'complete',
				techRecord_vehicleClass_code: 'vehicle class code',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClassCode(motorcycle)).toBe('vehicle class code');
		});

		it('should return undefined for incomplete motorcycles', () => {
			const motorcycle = {
				techRecord_vehicleType: VehicleTypes.MOTORCYCLE,
				techRecord_bodyType: 'body type',
				techRecord_recordCompleteness: 'incomplete',
				techRecord_vehicleClass_code: 'vehicle class code',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClassCode(motorcycle)).toBeUndefined();
		});

		it('should return undefined for non motorcycles', () => {
			const car = {
				techRecord_vehicleType: VehicleTypes.CAR,
				techRecord_bodyType: 'body type',
				techRecord_recordCompleteness: 'complete',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClassCode(car)).toBeUndefined();
		});
	});

	describe('getVehicleClass', () => {
		it('should return the vehicle class code for a complete motorcycle', () => {
			const motorcycle = {
				techRecord_vehicleType: VehicleTypes.MOTORCYCLE,
				techRecord_bodyType: 'body type',
				techRecord_recordCompleteness: 'complete',
				techRecord_vehicleClass_code: 'vehicle class code',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClass(motorcycle)).toBe('vehicle class code');
		});

		it('should return the vehicle class description for PSVs, HGVs and TRLs', () => {
			const psv = {
				techRecord_vehicleType: VehicleTypes.PSV,
				techRecord_bodyType: 'body type',
				techRecord_seatsLowerDeck: 10,
				techRecord_seatsUpperDeck: 12,
				techRecord_vehicleSize: 22,
				techRecord_vehicleClass_description: 'vehicle class description',
			} as unknown as V3TechRecordModel;

			const hgv = {
				techRecord_vehicleType: VehicleTypes.HGV,
				techRecord_bodyType: 'body type',
				techRecord_vehicleClass_description: 'vehicle class description',
			} as unknown as V3TechRecordModel;

			const trl = {
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_bodyType: 'body type',
				techRecord_vehicleClass_description: 'vehicle class description',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClass(psv)).toBe('vehicle class description');
			expect(service.getVehicleClass(hgv)).toBe('vehicle class description');
			expect(service.getVehicleClass(trl)).toBe('vehicle class description');
		});

		it('should return undefined for CARs and LGVs', () => {
			const car = {
				techRecord_vehicleType: VehicleTypes.CAR,
				techRecord_bodyType: 'body type',
			} as unknown as V3TechRecordModel;

			const lgv = {
				techRecord_vehicleType: VehicleTypes.LGV,
				techRecord_bodyType: 'body type',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleClass(car)).toBeUndefined();
			expect(service.getVehicleClass(lgv)).toBeUndefined();
		});
	});

	describe('getVehicleSubClass', () => {
		it('should return the vehicle sub class for a CARs and LGVs', () => {
			const car = {
				techRecord_vehicleType: VehicleTypes.CAR,
				techRecord_bodyType: 'body type',
				techRecord_vehicleSubclass: 'vehicle subclass',
			} as unknown as V3TechRecordModel;

			const lgv = {
				techRecord_vehicleType: VehicleTypes.LGV,
				techRecord_bodyType: 'body type',
				techRecord_vehicleSubclass: 'vehicle subclass',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleSubClass(car)).toBe('vehicle subclass');
			expect(service.getVehicleSubClass(lgv)).toBe('vehicle subclass');
		});

		it('should return undefined for non-CARs and non-LGVs', () => {
			const psv = {
				techRecord_vehicleType: VehicleTypes.PSV,
				techRecord_bodyType: 'body type',
				techRecord_vehicleSubclass: 'vehicle subclass',
			} as unknown as V3TechRecordModel;

			const hgv = {
				techRecord_vehicleType: VehicleTypes.HGV,
				techRecord_bodyType: 'body type',
				techRecord_vehicleSubclass: 'vehicle subclass',
			} as unknown as V3TechRecordModel;

			const trl = {
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_bodyType: 'body type',
				techRecord_vehicleSubclass: 'vehicle subclass',
			} as unknown as V3TechRecordModel;

			const motorcycle = {
				techRecord_vehicleType: VehicleTypes.MOTORCYCLE,
				techRecord_bodyType: 'body type',
				techRecord_vehicleSubclass: 'vehicle subclass',
			} as unknown as V3TechRecordModel;

			expect(service.getVehicleSubClass(psv)).toBeUndefined();
			expect(service.getVehicleSubClass(hgv)).toBeUndefined();
			expect(service.getVehicleSubClass(trl)).toBeUndefined();
			expect(service.getVehicleSubClass(motorcycle)).toBeUndefined();
		});
	});

	describe('getBrakeCode', () => {
		it('should use the brake code original if no gross laden weight is provided', () => {
			expect(
				service.getBrakeCode({ techRecord_brakes_brakeCodeOriginal: '12345' } as TechRecordTypeVehicle<'psv', 'put'>)
			).toBe('00012345');
		});

		it('should prefix the brake code orignal with the gross laden weight if it is provided', () => {
			expect(
				service.getBrakeCode({
					techRecord_brakes_brakeCodeOriginal: '12345',
					techRecord_grossLadenWeight: 4440,
				} as TechRecordTypeVehicle<'psv', 'put'>)
			).toBe('04412345');
		});
	});
});
