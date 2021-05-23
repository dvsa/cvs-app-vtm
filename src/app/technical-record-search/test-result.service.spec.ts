import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AppConfig } from '@app/app.config';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { TestResultService } from './test-result.service';
import { Store, INITIAL_STATE } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { hot } from 'jasmine-marbles';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';
import { LoadingTrue } from '@app/store/actions/Loader.actions';

const appConfigMock = {
  get settings() {
    return {
      apiServer: {
        APITestResultServerUri: 'http://localhost:3006',
        APICertificatesBlobUri: 'http://someCertificate'
      }
    };
  }
};

describe('TestResultService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TestResultService;
  let actions: ReplaySubject<any>;
  let store: Store<IAppState>;

  beforeEach(() => {
    actions = new ReplaySubject();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TestResultService,
        { provide: AppConfig, useValue: appConfigMock },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
        provideMockActions(() => actions)
      ]
    }).compileComponents();
    injector = getTestBed();
    store = injector.get(Store);
    service = injector.get(TestResultService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTestResults should return data', (done) => {
    const mock = { mockObject: 'mock' };
    spyOn(store, 'dispatch').and.callThrough();

    service.getTestResults('1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });
    expect(store.dispatch).toHaveBeenCalledWith(new LoadingTrue());

    const req = httpMock.expectOne((request) => request.url.includes('/test-results/1234567'));
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('updateTestResults should update', (done) => {
    const mock = { mockObject: 'mock' };
    spyOn(store, 'dispatch').and.callThrough();

    service
      .updateTestResults({ testResult: { testResultId: '123' } } as VehicleTestResultUpdate)
      .subscribe((res) => {
        expect(res).toBeDefined();
        expect(res).toEqual(mock);
        done();
      });
    expect(store.dispatch).toHaveBeenCalledWith(new LoadingTrue());

    const req = httpMock.expectOne((result) => result.url.includes(`/test-results/123`));
    req.flush(mock);
  });

  it('getPreparers should return preparers data', (done) => {
    const mock = { mockObject: 'mock' };
    spyOn(store, 'dispatch').and.callThrough();

    service.getPreparers().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne((request) => request.url.includes('/preparers'));
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getTestStations should return test stations data', (done) => {
    const mock = { mockObject: 'mock' };
    spyOn(store, 'dispatch').and.callThrough();

    service.getTestStations().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });
    expect(store.dispatch).toHaveBeenCalledWith(new LoadingTrue());

    const req = httpMock.expectOne((request) => request.url.includes('/test-stations'));
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getTestResultById should return test result data', (done) => {
    const mock = { mockObject: 'mock' };
    spyOn(store, 'dispatch').and.callThrough();

    service.getTestResultById('111', '222').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });
    expect(store.dispatch).toHaveBeenCalledWith(new LoadingTrue());

    const req = httpMock.expectOne((request) =>
      request.url.includes('/test-results/111?testResultId=222&version=all')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('archiveTestResult should return test result object', (done) => {
    const mockId = 'testId';
    spyOn(store, 'dispatch').and.callThrough();

    service
      .archiveTestResult({ testResult: { testResultId: '23' } } as VehicleTestResultUpdate)
      .subscribe((res) => {
        expect(res).toBeDefined();
        expect(res).toEqual(mockId);
        done();
      });
    expect(store.dispatch).toHaveBeenCalledWith(new LoadingTrue());

    const req = httpMock.expectOne((request) => request.url.includes('/test-results/archive/23'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockId);
  });

  describe('downloadCertificate', () => {
    it('should download the document', () => {
      const fileName = '_fileName';

      const uri = `${appConfigMock.settings.apiServer.APICertificatesBlobUri}${fileName}`;
      // act
      service.downloadCertificate(fileName).subscribe();

      // assert
      const getRequest = httpMock.expectOne((req) => req.url.includes(uri));
      expect(getRequest.request.method).toBe('GET');
      expect(getRequest.request.url).toEqual(uri);
      expect(getRequest.request.headers.get('Accept')).toEqual('*/*');
    });
  });

  it('getTestTypeCategories should return test type taxonomy data', (done) => {
    const mock = { mockObject: 'mock' };
    spyOn(store, 'dispatch').and.callThrough();

    service.getTestTypeCategories().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual(mock);
      done();
    });
    expect(store.dispatch).toHaveBeenCalledWith(new LoadingTrue());

    const req = httpMock.expectOne((request) => request.url.includes('/test-types'));
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
