import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GetTestResultsService, UpdateTestResultsService } from '@api/test-results';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { fetchTestResults, fetchTestResultsBySystemNumber, updateTestResultState } from '@store/test-records';
import { mockTestResult } from '../../../mocks/mock-test-result';
import { TestRecordsService } from './test-records.service';

describe('TestRecordsService', () => {
  let service: TestRecordsService;
  let httpTestingController: HttpTestingController;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState }), GetTestResultsService, UpdateTestResultsService]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TestRecordsService);
    store = TestBed.inject(MockStore);
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
      it('should throw error when systemNumber is empty', (done) => {
        service.fetchTestResultbySystemNumber('').subscribe({
          error: (e) => {
            expect(e.message).toBe('systemNumber is required');
            done();
          }
        });
      });

      it('should add query params to url', () => {
        const now = new Date('2022-01-01T00:00:00.000Z');
        service
          .fetchTestResultbySystemNumber('SystemNumber', {
            status: 'submited',
            fromDateTime: now,
            toDateTime: now,
            testResultId: 'TEST_RESULT_ID',
            version: '1'
          })
          .subscribe({ next: () => {} });

        // Check for correct requests: should have made one request to POST search from expected URL
        const req = httpTestingController.expectOne(
          `https://url/api/v1/test-results/SystemNumber?status=submited&fromDateTime=2022-01-01T00:00:00.000Z&toDateTime=2022-01-01T00:00:00.000Z&testResultId=TEST_RESULT_ID&version=1`
        );
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush([]);
      });

      it('should get a single test result', () => {
        const systemNumber = 'SYS0001';
        const mockData = mockTestResult();
        service.fetchTestResultbySystemNumber(systemNumber).subscribe((response) => {
          expect(response).toEqual(mockData);
        });

        // Check for correct requests: should have made one request to POST search from expected URL
        const req = httpTestingController.expectOne(`https://url/api/v1/test-results/SYS0001`);
        expect(req.request.method).toEqual('GET');

        // Provide each request with a mock response
        req.flush(mockData);
      });
    });
  });

  describe(TestRecordsService.prototype.loadTestResults.name, () => {
    it('should dispatch fetchTestResults action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      service.loadTestResults();
      expect(dispatchSpy).toHaveBeenCalledWith(fetchTestResults());
    });
  });

  describe(TestRecordsService.prototype.loadTestResultBySystemNumber.name, () => {
    it('should dispatch fetchTestResultsBySystemNumber action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const systemNumber = 'SYS0001';
      service.loadTestResultBySystemNumber(systemNumber);
      expect(dispatchSpy).toHaveBeenCalledWith(fetchTestResultsBySystemNumber({ systemNumber: systemNumber }));
    });
  });

  describe(TestRecordsService.prototype.updateTestResultState.name, () => {
    it('should dispatch updateTestResultState action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const args = { testResultId: 'testResultId', testTypeId: 'testTypeId', section: 'section', value: 'some value' };
      service.updateTestResultState(args);
      expect(dispatchSpy).toHaveBeenCalledWith(updateTestResultState(args));
    });
  });
});
