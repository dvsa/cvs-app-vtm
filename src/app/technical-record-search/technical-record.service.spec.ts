import {TestBed, inject, getTestBed, ComponentFixture} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TechnicalRecordService} from './technical-record.service';
import {AuthenticationGuard, MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {Store, StoreModule} from '@ngrx/store';
import {appReducers} from '@app/store/reducers/app.reducers';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@app/material.module';
import {SharedModule} from '@app/shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgrxFormsModule} from 'ngrx-forms';
import {hot} from 'jasmine-marbles';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationGuardMock} from '../../../testconfig/services-mocks/authentication-guard.mock';
import {TechnicalRecordSearchModule} from "@app/technical-record-search/technical-record-search.module";
import {environment} from "@environments/environment";
import { adrDetailsReducer } from '@app/adr-details-form/store/adrDetails.reducer';
import { INITIAL_STATE } from '@app/adr-details-form/store/adrDetailsForm.state';
import { IAppState } from '@app/store/state/app.state';

export const adalConfig = {
  cacheLocation: 'localStorage',
  clientId: 'appId',
  endpoints: {
    api: 'endpoint'
  },
  postLogoutRedirectUri: window.location.origin,
  tenant: '<tenant name>.onmicrosoft.com'
};

const routes = {
  techRecords: (searchIdentifier: string) => `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records`,
  techRecordsAllStatuses: (searchIdentifier: string) =>
    `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records?status=all&metadata=true`
};

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('TechnicalRecordService', () => {

  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TechnicalRecordService;
  const authenticationGuardMock = new AuthenticationGuardMock();
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(appReducers),
        TechnicalRecordSearchModule,
        HttpClientTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule,
        StoreModule.forFeature('adrDetails', adrDetailsReducer),
        FontAwesomeModule,
        ReactiveFormsModule,
        NgrxFormsModule,
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            'https://localhost/Api/': 'xxx-xxx1-1111-x111-xxx'
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage',
        })
      ],
      providers: [
        TechnicalRecordService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
        {provide: AuthenticationGuard, useValue: authenticationGuardMock},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useClass: MockRouter}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
        // TO SORT LATER
        // store = TestBed.get(Store);
        // spyOn(store, 'dispatch').and.callThrough();
        injector = getTestBed();
        // service  = injector.get(TechnicalRecordService);
        // httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    // httpMock.verify();
  });

  test.skip('should be created', inject([HttpTestingController, MsAdalAngular6Service], (serviceI: TechnicalRecordService) => {
    expect(serviceI).toBeTruthy();
  }));

  test.skip('getTechnicalRecordsAllStatuses should return data', (done) => {
    service.getTechnicalRecordsAllStatuses('1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual({mockObject: 'mock'});
      done();
    });

    const req = httpMock.expectOne(routes.techRecordsAllStatuses('1234567'));
    expect(req.request.method).toBe('GET');
    req.flush({mockObject: 'mock'});
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
