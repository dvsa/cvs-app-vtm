import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { environment } from '../../../environments/environment';
import { mockVehicleTecnicalRecordList } from '../../../mocks/mock-vehicle-technical-record.mock';
import { TechnicalRecordService } from './technical-record.service';

describe('TechnicalRecordService', () => {
  let service: TechnicalRecordService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
    describe('getByVIN', () => {
      it('should get an array of matching results', () => {
        const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
        const mockData = mockVehicleTecnicalRecordList(1);
        service.getByVIN(searchParams.searchTerm).subscribe((response) => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vin`);
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush(mockData);
      });

      it('should handle errors', () => {
        const searchParams = { searchTerm: 'A_VIN', type: 'vin' };
        const mockData = mockVehicleTecnicalRecordList(1);
        service.getByVIN(searchParams.searchTerm).subscribe((response) => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to search from expected URL
        const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/vehicles/${searchParams.searchTerm}/tech-records?status=all&metadata=true&searchCriteria=vin`);
        expect(req.request.method).toEqual('GET');

        // Respond with mock error
        req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
      });
    });
  });
});
