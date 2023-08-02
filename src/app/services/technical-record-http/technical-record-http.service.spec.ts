import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/index';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TechnicalRecordHttpService } from './technical-record-http.service';

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordHttpService;
  let httpClient: HttpTestingController;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [TechnicalRecordHttpService, provideMockStore({ initialState: initialAppState })]
    });
    httpClient = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TechnicalRecordHttpService);
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
        service.createProvisionalTechRecord(mockData[0] as unknown as V3TechRecordModel).subscribe();

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
        service.updateTechRecords(mockData[0] as unknown as V3TechRecordModel).subscribe();

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
        service.updateTechRecords(mockData[0] as unknown as V3TechRecordModel).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles/${params.systemNumber}`);
        expect(req.request.method).toEqual('PUT');

        // Provide each request with a mock response
        req.flush(mockData);
      }));
    });

    describe('updateVin', () => {
      it('should make POST request to correct URL', fakeAsync(() => {
        const params = { systemNumber: '12345', vin: 'MYNEWVIN', user: { name: 'TEST', id: '1234' } };
        service.updateVin(params.vin, params.systemNumber, params.user).subscribe();

        const req = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles/update-vin/${params.systemNumber}`);
        expect(req.request.method).toEqual('PUT');
      }));
    });

    describe('archiveTechRecord', () => {
      it('should return a new tech record having added provisional', fakeAsync(() => {
        const params = { systemNumber: '12345', reasonForArchiving: 'some reason', user: { name: 'TEST', id: '1234' } };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.archiveTechnicalRecord(mockData[0].techRecord[0] as unknown as V3TechRecordModel).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpClient.expectOne(`${environment.VTM_API_URI}/vehicles/archive/${params.systemNumber}`);
        expect(req.request.method).toEqual('PUT');

        // Provide each request with a mock response
        req.flush(mockData);
      }));
    });
  });
});
