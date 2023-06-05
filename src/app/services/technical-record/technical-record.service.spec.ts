import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockVehicleTechnicalRecord, mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';
import { initialAppState, State } from '@store/index';
import { editableVehicleTechRecord, selectVehicleTechnicalRecordsBySystemNumber, updateEditingTechRecord } from '@store/technical-records';
import { environment } from '../../../environments/environment';
import { TechnicalRecordService } from './technical-record.service';

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordService;
  let httpClient: HttpTestingController;
  let store: MockStore<State>;

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
      const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(mockData);
    });

    it('should validate the search term to be unique when no matching results are returned', () => {
      const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
      const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
      mockData[0].techRecord.forEach(record => (record.statusCode = StatusCodes.ARCHIVED));

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(mockData);
    });

    it('should validate the search term to be non unique when matching results are returned and are current or provisional', () => {
      const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
      const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(false);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vin`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(mockData);
    });

    it('should validate the search term to be non unique when vrm is used as a primary', () => {
      const searchParams = { searchTerm: 'KP01 ABC', type: 'vrm' };
      const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VRM).subscribe(response => {
        expect(response).toEqual(false);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vrm`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(mockData);
    });

    it('should validate the search term to be unique when vrm is not used as a primary', () => {
      const searchParams = { searchTerm: '12345', type: 'vrm' };
      const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VRM).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(`${environment.VTM_API_URI}/v3/technical-records/search/${searchParams.searchTerm}?searchCriteria=vrm`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(mockData);
    });
  });

  describe('business logic methods', () => {
    describe('updateEditingTechRecord', () => {
      it('should patch the missing information for the technical record and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV);
        mockVehicleRecord.techRecord = [mockVehicleRecord.techRecord[0]];
        store.overrideSelector(editableVehicleTechRecord, mockVehicleRecord);
        service.updateEditingTechRecord(mockVehicleRecord.techRecord[0]);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it('should patch from the selected record if the editing is not defined and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV);
        mockVehicleRecord.techRecord = [mockVehicleRecord.techRecord[0]];
        store.overrideSelector(editableVehicleTechRecord, undefined);
        store.overrideSelector(selectVehicleTechnicalRecordsBySystemNumber, mockVehicleRecord);
        service.updateEditingTechRecord(mockVehicleRecord.techRecord[0]);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it('override the editable tech record and dispatch the action to update the editing vehicle record with the full vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV);
        mockVehicleRecord.techRecord = [mockVehicleRecord.techRecord[0]];

        const mockEditableVehicleRecord = { vin: 'a random vin' } as VehicleTechRecordModel;

        store.overrideSelector(editableVehicleTechRecord, mockEditableVehicleRecord);
        store.overrideSelector(selectVehicleTechnicalRecordsBySystemNumber, mockVehicleRecord);
        service.updateEditingTechRecord(mockVehicleRecord.techRecord[0], true);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).not.toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockEditableVehicleRecord }));
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });

      it('should throw an error if there is more than one tech record', () => {
        const mockVehicleRecord = mockVehicleTechnicalRecord();
        expect(() => service.updateEditingTechRecord(mockVehicleRecord)).toThrowError('Editing tech record can only have one technical record!');
      });

      it('should throw an error if there is more than one tech record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = mockVehicleTechnicalRecord();
        mockVehicleRecord.techRecord = mockVehicleRecord.techRecord.filter(techRecord => techRecord.statusCode === StatusCodes.CURRENT);
        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });
    });
  });
});
