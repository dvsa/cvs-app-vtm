import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
  TechRecordGETHGV,
  TechRecordGETPSV,
  TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/index';
import { updateEditingTechRecord } from '@store/technical-records';
import { ReferenceDataResourceType, ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import { AxleTyreProperties } from '@api/vehicle';
import { environment } from '../../../environments/environment';
import { TechnicalRecordService } from './technical-record.service';
import FitmentCodeEnum = AxleTyreProperties.FitmentCodeEnum;

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordService;
  let httpClient: HttpTestingController;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [TechnicalRecordService, provideMockStore({ initialState: initialAppState })],
    });
    httpClient = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TechnicalRecordService);
    store = TestBed.inject(MockStore);
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
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
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
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
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
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
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
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=primaryVrm`);
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
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=primaryVrm`);
      expect(req.request.method).toBe('GET');

      // Provide each request with a mock response
      req.flush(mockData);
    });
  });

  describe('getVehicleMakeAndModel', () => {
    it('should return an empty string if there is no make and model', () => {
      const record = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'put'>;
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
        const mockVehicleRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'put'>;

        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it(`should patch from the selected record if the editing is
      not defined and dispatch the action to update the editing
      vehicle record with the full vehicle record`, () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'put'>;

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
            vehicleTechRecord: { ...mockVehicleRecord, techRecord_axles: [{}, {}], techRecord_noOfAxles: 2 } as TechRecordType<'put'>,
          }),
        );
      });

      it('override the editable tech record and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'put'>;

        const mockEditableVehicleRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'a random vin' } as unknown as TechRecordType<'put'>;

        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).not.toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockEditableVehicleRecord }));
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it('should throw an error if there is more than one tech record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'put'>;
        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });
    });
  });

  describe('getMakeAndModel', () => {
    it('should should return the make and model', () => {
      expect(service.getMakeAndModel({ techRecord_make: 'Test', techRecord_model: 'Car' } as V3TechRecordModel)).toBe('Test - Car');
    });

    it('should return an empty string when the current record has no values for make and model', () => {
      expect(service.getMakeAndModel({ techRecord_make: undefined, techRecord_model: undefined } as V3TechRecordModel)).toBe('');
    });
  });

  describe('haveAxlesChanged', () => {
    it('should return true if a property of the hgv gross axle has changed', () => {
      const vehicleType = VehicleTypes.HGV;
      const changes = { techRecord_grossDesignWeight: 1, techRecord_grossEecWeight: 2, techRecord_grossGbWeight: 3 } as Partial<TechRecordGETHGV>;
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
        techRecord_grossKerbWeight: 1, techRecord_grossLadenWeight: 1, techRecord_grossDesignWeight: 1, techRecord_grossGbWeight: 1,
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
      const changes = { techRecord_grossDesignWeight: 1, techRecord_grossEecWeight: 2, techRecord_grossGbWeight: 3 } as Partial<TechRecordGETTRL>;
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
      const changes = { techRecord_trainDesignWeight: 1, techRecord_trainEecWeight: 2, techRecord_trainGbWeight: 3 } as Partial<TechRecordGETHGV>;
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
      const changes = { techRecord_trainDesignWeight: 1, techRecord_trainEecWeight: 2, techRecord_trainGbWeight: 3 } as Partial<TechRecordGETPSV>;
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
      const changes = { techRecord_grossDesignWeight: 1, techRecord_grossEecWeight: 2, techRecord_grossGbWeight: 3 } as Partial<TechRecordGETTRL>;
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
      const changes = { techRecord_grossDesignWeight: 1, techRecord_grossEecWeight: 2, techRecord_grossGbWeight: 3 } as Partial<TechRecordGETHGV>;
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
      const result = service.hasMaxTrainAxleChanged(changes); expect(spy).toHaveBeenCalledWith(changes);
      expect(result).toBe(true);
    });

    it('should return false if no properties of the max train axle have changed', () => {
      const changes = {} as Partial<TechRecordGETHGV>;
      const spy = jest.spyOn(service, 'hasMaxTrainAxleChanged');
      const result = service.hasMaxTrainAxleChanged(changes); expect(spy).toHaveBeenCalledWith(changes);
      expect(result).toBe(false);
    });
  });

  describe('hasPsvGrossAxleChanged', () => {
    it('should return true if a property of the psv gross axle has changed', () => {
      const changes = { techRecord_grossDesignWeight: 1, techRecord_grossEecWeight: 2, techRecord_grossGbWeight: 3 } as Partial<TechRecordGETPSV>;
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
    const loadIndexArray: ReferenceDataTyreLoadIndex[] = [{
      resourceType: ReferenceDataResourceType.Tyres, resourceKey: loadIndex, loadIndex: '825',
    }];
    it('should return double the loadIndex value passed in if fitment code is set to single', () => {
      const fitmentCodeType = FitmentCodeEnum.Single;
      const result = service.getAxleFittingWeightValueFromLoadIndex(loadIndex, fitmentCodeType, loadIndexArray);
      expect(result).toBe(1650);
    });
    it('should return quadruple the loadIndex value passed in if fitment code is set to single', () => {
      const fitmentCodeType = FitmentCodeEnum.Double;
      const result = service.getAxleFittingWeightValueFromLoadIndex(loadIndex, fitmentCodeType, loadIndexArray);
      expect(result).toBe(3300);
    });
  });
});
