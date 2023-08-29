import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType as VehicleRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';
import { State, initialAppState } from '@store/index';
import { updateEditingTechRecord } from '@store/technical-records';
import { environment } from '../../../environments/environment';
import { TechnicalRecordService } from './technical-record.service';

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordService;
  let httpClient: HttpTestingController;
  let store: MockStore<State>;
  const mockVehicleRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'put'>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [TechnicalRecordService, provideMockStore({ initialState: initialAppState })]
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
    it('should validate the search term to be unique when no matching results are returned', () => {
      const searchParams = { searchTerm: '12345', type: 'vin' };

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
      expect(req.request.method).toEqual('GET');
    });

    it('should validate the search term to be unique when no matching results are returned', () => {
      const searchParams = { searchTerm: 'A_VIN', type: 'vin' };

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
      expect(req.request.method).toEqual('GET');
    });

    it('should validate the search term to be non unique when matching results are returned and are current or provisional', () => {
      const searchParams = { searchTerm: 'A_VIN', type: 'vin' };

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(false);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
      expect(req.request.method).toEqual('GET');
    });

    it('should validate the search term to be non unique when vrm is used as a primary', () => {
      const searchParams = { searchTerm: 'KP01 ABC', type: 'vrm' };

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VRM).subscribe(response => {
        expect(response).toEqual(false);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=primaryVrm`);
      expect(req.request.method).toEqual('GET');
    });

    it('should validate the search term to be unique when vrm is not used as a primary', () => {
      const searchParams = { searchTerm: '12345', type: 'vrm' };

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VRM).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=primaryVrm`);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('getVehicleMakeAndModel', () => {
    it('should return an empty string if there is no make and model', () => {
      const record = mockVehicleTechnicalRecord('hgv') as VehicleRecordType<'hgv'>;
      record.techRecord_make = undefined;
      expect(service.getMakeAndModel(record)).toBe('');
    });
    it('for a PSV returns the chassis make and model', () => {
      const record: V3TechRecordModel = mockVehicleTechnicalRecord('psv');
      expect(service.getMakeAndModel(record)).toBe('Chassis make - Chassis model');
    });
    it('for a any other type returns make and model', () => {
      const record: V3TechRecordModel = mockVehicleTechnicalRecord('hgv');
      expect(service.getMakeAndModel(record)).toBe('1234 - 1234');
    });
  });

  describe('business logic methods', () => {
    describe('updateEditingTechRecord', () => {
      it('should patch the missing information for the technical record and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it('should patch from the selected record if the editing is not defined and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it('override the editable tech record and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        const mockEditableVehicleRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'a random vin' } as unknown as TechRecordType<'put'>;

        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).not.toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockEditableVehicleRecord }));
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it('should throw an error if there is more than one tech record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');

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
});
