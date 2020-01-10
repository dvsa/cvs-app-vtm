import {TestBed, inject, getTestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {TestResultService} from './test-result.service';
import {APP_BASE_HREF} from '@angular/common';
import {Store, StoreModule} from '@ngrx/store';
import {appReducers} from '@app/store/reducers/app.reducers';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@app/material.module';
import {SharedModule} from '@app/shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import { environment } from '@environments/environment';
import {NgrxFormsModule} from 'ngrx-forms';
import {AuthenticationGuardMock} from '../../../testconfig/services-mocks/authentication-guard.mock';
import {Router} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {hot} from 'jasmine-marbles';
import {TechnicalRecordSearchModule} from "@app/technical-record-search/technical-record-search.module";
import { adrDetailsReducer } from '@app/adr-details-form/store/adrDetails.reducer';
import { INITIAL_STATE } from '@app/adr-details-form/store/adrDetailsForm.state';
import { IAppState } from '@app/store/state/app.state';

const routes = {
  testResults: (searchIdentifier: string) => `${environment.APITestResultServerUri}/test-results/${searchIdentifier}`,
};

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('TestResultService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let service: TestResultService;
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
        NgrxFormsModule
      ],
      declarations: [],
      providers: [
        TestResultService,
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
        // service  = injector.get(TestResultService);
        // httpMock = injector.get(HttpTestingController);
  });

  beforeEach( ()=> {
    injector = getTestBed();
    //TO SORT LATER
    // service  = injector.get(TestResultService);
    // httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    // httpMock.verify();
  });

  test.skip('should be created', inject([HttpTestingController], (serviceI: TestResultService) => {
    expect(serviceI).toBeTruthy();
  }));

  test.skip('getTechnicalRecords should return data', (done) => {
    service.getTestResults('1234567').subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toEqual({mockObject: 'mock'});
      done();
    });

    const req = httpMock.expectOne(routes.testResults('1234567'));
    expect(req.request.method).toBe('GET');
    req.flush({mockObject: 'mock'});
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
