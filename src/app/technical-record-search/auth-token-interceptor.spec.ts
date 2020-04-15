import {fakeAsync, getTestBed, TestBed, tick} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthTokenInterceptor} from './auth-token-interceptor';
import {MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {environment} from '@environments/environment';
import {TestResultService} from '@app/technical-record-search/test-result.service';
import {AppConfig} from '@app/app.config';
import {inject} from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';

describe('AuthTokenInterceptor', () => {

  const appConfigMock = {
    get settings() {
      return {
        apiServer: {
          APITestResultServerUri: 'http://localhost:3006'
        }
      };
    }
  };

  const routes = {
    testResults: (searchIdentifier: string) => `${environment.APITestResultServerUri}/test-results/${searchIdentifier}`,
  };

  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TestResultService;
  let adal: MsAdalAngular6Service;
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            'https://localhost/Api/': 'xxx-xxx1-1111-x111-xxx'
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage'
        }),
      ],
      providers: [
        TestResultService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthTokenInterceptor,
          multi: true,
        },
        {
          provide: Store,
          useValue: {
            select: jest.fn(),
            dispatch: jest.fn(),
          }
        },
        {provide: AppConfig, useValue: appConfigMock},

      ]
    });

    injector = getTestBed();
    httpMock = TestBed.get(HttpTestingController);
    service = injector.get(TestResultService);
    store = injector.get(Store);
    adal = TestBed.get(MsAdalAngular6Service);

  });

  it('service should be created', () => {
    expect(service).toBeTruthy();
  });

});
