import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { environment } from '../../../environments/environment';
import { mockVehicleTechnicalRecordList } from '../../../mocks/mock-vehicle-technical-record.mock';
import { TechnicalRecordService } from './technical-record.service';

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [TechnicalRecordService, provideMockStore({ initialState: initialAppState })]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TechnicalRecordService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
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
        const req = httpTestingController.expectOne(
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
        const req = httpTestingController.expectOne(
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
        const req = httpTestingController.expectOne(
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
        const req = httpTestingController.expectOne(
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
        const req = httpTestingController.expectOne(
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
        const req = httpTestingController.expectOne(
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
        const req = httpTestingController.expectOne(
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
        const req = httpTestingController.expectOne(
          `${environment.VTM_API_URI}/vehicles/${params.term}/tech-records?status=all&metadata=true&searchCriteria=${params.type}`
        );
        expect(req.request.method).toEqual('GET');

        // Respond with mock error
        req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
      });
    });

    describe('putUpdateTechRecords', () => {
      it('should return an array with a new tech record and updated status code', fakeAsync(() => {
        const params = { systemNumber: '12345', user: { username: 'TEST', id: '1234' }, oldStatusCode: StatusCodes.PROVISIONAL };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.putUpdateTechRecords(params.systemNumber, mockData[0].techRecord[0], params.user, params.oldStatusCode).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpTestingController.expectOne(
          `${environment.VTM_API_URI}/vehicles/${params.systemNumber}?oldStatusCode=${params.oldStatusCode}`
        );
        expect(req.request.method).toEqual('PUT');

        // Provide each request with a mock response
        req.flush(mockData);
      }));

      it('should return an array with a new tech record and updated status code using basic URL', fakeAsync(() => {
        const params = { systemNumber: '12345', user: { username: 'TEST', id: '1234' } };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.putUpdateTechRecords(params.systemNumber, mockData[0].techRecord[0], params.user).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/vehicles/${params.systemNumber}`);
        expect(req.request.method).toEqual('PUT');

        // Provide each request with a mock response
        req.flush(mockData);
      }));
    });

    describe('postProvisionalTechRecord', () => {
      it('should return an array with a new tech record having added provisional', fakeAsync(() => {
        const params = { systemNumber: '12345', user: { username: 'TEST', id: '1234' } };
        const mockData = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);
        service.postProvisionalTechRecord(params.systemNumber, mockData[0].techRecord[0], params.user).subscribe();

        // Check for correct requests: should have made one request to the PUT URL
        const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/vehicles/add-provisional/${params.systemNumber}`);
        expect(req.request.method).toEqual('POST');

        // Provide each request with a mock response
        req.flush(mockData);
      }));
    });
  });
});
