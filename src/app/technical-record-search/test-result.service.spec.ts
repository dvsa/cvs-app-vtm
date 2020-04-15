import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AppConfig } from '@app/app.config';
import { environment } from '@environments/environment';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { TestResultService } from './test-result.service';
import { Store, INITIAL_STATE } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { hot } from 'jasmine-marbles';

const routes = {
  testResults: (searchIdentifier: string) => `${environment.APITestResultServerUri}/test-results/${searchIdentifier}`,
};

const appConfigMock = {
  get settings() {
    return {
      apiServer: {
        APITestResultServerUri: 'http://localhost:3006'
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
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        TestResultService,
        { provide: AppConfig, useValue: appConfigMock },
        {
          provide: Store, useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
        provideMockActions(() => actions),
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

  it('getTechnicalRecords should return data', (done) => {
    service.getTestResults('1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual({ mockObject: 'mock' });
      done();
    });

    const req = httpMock.expectOne(routes.testResults('1234567'));
    expect(req.request.method).toBe('GET');
    req.flush({ mockObject: 'mock' });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
