import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockVehicleTechnicalRecord, mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/index';
import { editableVehicleTechRecord, selectVehicleTechnicalRecordsBySystemNumber, updateEditingTechRecord } from '@store/technical-records';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SEARCH_TYPES, TechnicalRecordService } from './technical-record.service';

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

  describe('API', () => {
    describe('getByVin', () => {
      it('should get an array of matching results', () => {
        const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByVin(searchParams.searchTerm).subscribe(response => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vin`
        );
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush(mockData);
      });

      it('should handle errors', () => {
        const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByVin(searchParams.searchTerm).subscribe(response => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vin`
        );
        expect(req.request.method).toEqual('GET');

        // Respond with mock error
        req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
      });
    });

    describe('getByPartialVin', () => {
      it('should get an array of matching results', () => {
        const searchParams = { searchTerm: 'A_VIN', type: 'partialVin' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByPartialVin(searchParams.searchTerm).subscribe(response => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=partialVin`
        );
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush(mockData);
      });

      it('should handle errors', () => {
        const searchParams = { searchTerm: 'A_VIN', type: 'partialVin' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByPartialVin(searchParams.searchTerm).subscribe(response => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=partialVin`
        );
        expect(req.request.method).toEqual('GET');

        // Respond with mock error
        req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
      });
    });

    describe('getByVrm', () => {
      it('should get an array of matching results', () => {
        const params = { term: 'A_VRM', type: 'vrm' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByVrm(params.term).subscribe(response => expect(response).toEqual(mockData));

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${params.term}/tech-records?status=all&metadata=true&searchCriteria=${params.type}`
        );
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush(mockData);
      });

      it('should handle errors', () => {
        const params = { term: 'A_VRM', type: 'vrm' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByVrm(params.term).subscribe(response => expect(response).toEqual(mockData));

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${params.term}/tech-records?status=all&metadata=true&searchCriteria=${params.type}`
        );
        expect(req.request.method).toEqual('GET');

        // Respond with mock error
        req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
      });
    });

    describe('getByTrailerId', () => {
      it('should get an array of matching results', () => {
        const params = { term: 'A_TRAILER_ID', type: 'trailerId' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByTrailerId(params.term).subscribe(response => expect(response).toEqual(mockData));

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${params.term}/tech-records?status=all&metadata=true&searchCriteria=${params.type}`
        );
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush(mockData);
      });

      it('should handle errors', () => {
        const params = { term: 'A_TRAILER_ID', type: 'trailerId' };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.getByTrailerId(params.term).subscribe(response => expect(response).toEqual(mockData));

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpClient.expectOne(
          `${environment.VTM_API_URI}/vehicles/${params.term}/tech-records?status=all&metadata=true&searchCriteria=${params.type}`
        );
        expect(req.request.method).toEqual('GET');

        // Respond with mock error
        req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
      });
    });

    describe('createVehicleRecord', () => {
      it('should call post with the correct URL, body and response type', fakeAsync(() => {
        const expectedVehicle = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1)[0];
        const expectedUser = { name: 'test', id: '1234' };

        service.createVehicleRecord(expectedVehicle, expectedUser).subscribe();

        const expectedBody = {
          msUserDetails: { msOid: expectedUser.id, msUser: expectedUser.name },
          vin: expectedVehicle.vin,
          primaryVrm: expectedVehicle.vrms ? expectedVehicle.vrms[0].vrm : null,
          trailerId: expectedVehicle.trailerId ?? null,
          techRecord: expectedVehicle.techRecord
        };

        const request = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles`);

        expect(request.request.method).toEqual('POST');
        expect(request.request.body).toEqual(expectedBody);

        request.flush(expectedVehicle);
      }));

      it('should return an array with the newly created vehicle record', () => {
        const expectedVehicle = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1)[0];

        const expectedResult = {
          vin: expectedVehicle.vin,
          primaryVrm: expectedVehicle.vrms ? expectedVehicle.vrms[0].vrm : null,
          trailerId: expectedVehicle.trailerId ?? null,
          techRecord: expectedVehicle.techRecord
        };

        expect(lastValueFrom(service.createVehicleRecord(expectedVehicle, { name: 'test', id: '1234' }))).resolves.toEqual(expectedResult);

        const request = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles`);
        request.flush(expectedResult);
      });
    });

    describe('createProvisionalTechRecord', () => {
      it('should return an array with a new tech record having added provisional', fakeAsync(() => {
        const params = { systemNumber: '12345', user: { name: 'TEST', id: '1234' } };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.createProvisionalTechRecord(params.systemNumber, mockData[0].techRecord[0], params.user).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles/add-provisional/${params.systemNumber}`);
        expect(req.request.method).toEqual('POST');

        // Provide each request with a mock response
        req.flush(mockData);
      }));
    });

    describe('updateTechRecords', () => {
      it('should return an array with a new tech record and updated status code', fakeAsync(() => {
        const params = { systemNumber: '12345', user: { name: 'TEST', id: '1234' }, oldStatusCode: StatusCodes.PROVISIONAL };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.updateTechRecords(params.systemNumber, mockData[0], params.user, params.oldStatusCode).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles/${params.systemNumber}?oldStatusCode=${params.oldStatusCode}`);
        expect(req.request.method).toEqual('PUT');

        // should format the vrms for the update payload
        expect(req.request.body).toHaveProperty('primaryVrm');
        expect(req.request.body).toHaveProperty('secondaryVrms');
        expect(req.request.body).not.toHaveProperty('vrms');

        // Provide each request with a mock response
        req.flush(mockData);
      }));

      it('should return an array with a new tech record and updated status code using basic URL', fakeAsync(() => {
        const params = { systemNumber: '12345', user: { name: 'TEST', id: '1234' } };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.updateTechRecords(params.systemNumber, mockData[0], params.user).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles/${params.systemNumber}`);
        expect(req.request.method).toEqual('PUT');

        // Provide each request with a mock response
        req.flush(mockData);
      }));
    });

    describe('archiveTechRecord', () => {
      it('should return a new tech record having added provisional', fakeAsync(() => {
        const params = { systemNumber: '12345', reasonForArchiving: 'some reason', user: { name: 'TEST', id: '1234' } };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.archiveTechnicalRecord(params.systemNumber, mockData[0].techRecord[0], params.reasonForArchiving, params.user).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles/archive/${params.systemNumber}`);
        expect(req.request.method).toEqual('PUT');

        // Provide each request with a mock response
        req.flush(mockData);
      }));
    });
  });

  describe('isUnique', () => {
    it('should validate the search term to be unique when no matching results are returned', () => {
      const searchParams = { searchTerm: '12345', type: 'vin' };
      const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(
        `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vin`
      );
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(mockData);
    });

    it('should validate the search term to be unique when no matching results are returned', () => {
      const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
      const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
      mockData[0].techRecord.map(record => (record.statusCode = StatusCodes.ARCHIVED));

      service.isUnique(searchParams.searchTerm, SEARCH_TYPES.VIN).subscribe(response => {
        expect(response).toEqual(true);
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpClient.expectOne(
        `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vin`
      );
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
      const req = httpClient.expectOne(
        `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vin`
      );
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
      const req = httpClient.expectOne(
        `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vrm`
      );
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
      const req = httpClient.expectOne(
        `${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vrm`
      );
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

      it('should call the store with the vehicle record', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        const mockVehicleRecord = mockVehicleTechnicalRecord();
        service.updateEditingTechRecord(mockVehicleRecord);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockVehicleRecord }));
      });
    });
  });
});
