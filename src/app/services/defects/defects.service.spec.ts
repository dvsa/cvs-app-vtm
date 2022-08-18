import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Defect } from '@models/defects/defect.model';
import { environment } from '../../../environments/environment';


import { DefectsService } from './defects.service';

describe('DefectsService', () => {
  let service: DefectsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DefectsService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchDefects', () => {
    it('should get an array of matching results', () => {
      const expectedResult = [{ imDescription: 'Some Description' } as Defect];
      service.fetchDefects().subscribe(response => expect(response).toEqual(expectedResult));

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(expectedResult);
    });

    it('should handle errors', done => {
      service.fetchDefects().subscribe({
        next: () => {},
        error: e => {
          expect(e.error).toEqual('Deliberate 500 error');
          expect(e.status).toEqual(500);
          expect(e.statusText).toEqual('Server Error');
          done();
        }
      });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects`);
      expect(req.request.method).toEqual('GET');

      // Respond with mock error
      req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('fetchDefect', () => {
    it('should get a matching result', () => {
      const expectedId = 'some ID';
      const expectedResult = { imDescription: 'Some Description' } as Defect;
      service.fetchDefect(expectedId).subscribe(response => expect(response).toEqual(expectedResult));

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects/${expectedId}`);
      expect(req.request.method).toEqual('GET');

      // Provide each request with a mock response
      req.flush(expectedResult);
    });

    it('should handle errors', done => {
      const expectedId = 'some ID';
        service.fetchDefect(expectedId).subscribe({
          next: () => {},
          error: e => {
            expect(e.error).toEqual('Deliberate 500 error');
            expect(e.status).toEqual(500);
            expect(e.statusText).toEqual('Server Error');
            done();
          }
        });

      // Check for correct requests: should have made one request to search from expected URL
      const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects/${expectedId}`);
      expect(req.request.method).toEqual('GET');

      // Respond with mock error
      req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
    });
  });
});
