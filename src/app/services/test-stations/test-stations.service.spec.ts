import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TestStation } from '@models/test-station.model';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { initialAppState } from '../../store';
import { TestStationsService } from './test-stations.service';

describe('TestStationsService', () => {
  let service: TestStationsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestStationsService, provideMockStore({ initialState: initialAppState })]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TestStationsService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchTestStations', () => {
    it('should get an array of matching results', () => {
      const expectedResult = [{ testStationName: 'Some Name' } as TestStation];
      service.fetchTestStations().subscribe(response => expect(response).toEqual(expectedResult));

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations/`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(expectedResult);
    });

    it('should handle errors', done => {
      service.fetchTestStations().subscribe({
        next: () => {},
        error: e => {
          expect(e.error).toEqual('Deliberate 500 error');
          expect(e.status).toEqual(500);
          expect(e.statusText).toEqual('Server Error');
          done();
        }
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations/`);
      expect(req.request.method).toEqual('GET');

      // Respond with mock error
      req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('fetchTestStation', () => {
    it('should get a matching result', () => {
      const expectedId = 'some ID';
      const expectedResult = { testStationName: 'Some Name' } as TestStation;
      service.fetchTestStation(expectedId).subscribe(response => expect(response).toEqual(expectedResult));

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations/${expectedId}`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(expectedResult);
    });

    it('should handle errors', done => {
      const expectedId = 'some ID';
        service.fetchTestStation(expectedId).subscribe({
          next: () => {},
          error: e => {
            expect(e.error).toEqual('Deliberate 500 error');
            expect(e.status).toEqual(500);
            expect(e.statusText).toEqual('Server Error');
            done();
          }
        });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations/${expectedId}`);
      expect(req.request.method).toEqual('GET');

      // Respond with mock error
      req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
    });
  });
});
