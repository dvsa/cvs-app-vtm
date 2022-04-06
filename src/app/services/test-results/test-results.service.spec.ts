import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { environment } from '../../../environments/environment';
import { mockTestResult } from '../../../mocks/mock-test-result';
import { TestResultsService } from './test-results.service';

describe('TestResultsService', () => {
  let service: TestResultsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestResultsService, provideMockStore({ initialState: initialAppState })]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TestResultsService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('API', () => {
    describe('fetchTestResultbyServiceId', () => {
      it('should get a single test result', () => {
        const systemId = 'SYS0001';
        const mockData = mockTestResult();
        service.fetchTestResultbyServiceId(systemId).subscribe((response) => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to POST search from expected URL
        const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-results/${systemId}`);
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush(mockData);
      });
    });
  });
});
