import { async, ComponentFixture, TestBed, getTestBed, inject } from '@angular/core/testing';
import { TechnicalRecordSearchComponent } from './technical-record-search.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material.module';
import {SharedModule} from '../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Store, StoreModule, INITIAL_STATE} from '@ngrx/store';
import {AuthenticationGuard, MsAdalAngular6Service, MsAdalAngular6Module} from 'microsoft-adal-angular6';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AuthenticationGuardMock} from '../../../../test-config/services-mocks/authentication-guard.mock';
import {Subject} from 'rxjs';
import { appReducers } from '@app/store/reducers/app.reducers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { adrDetailsReducer } from '@app/store/reducers/adrDetailsForm.reducer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgrxFormsModule } from 'ngrx-forms';
import { hot } from 'jasmine-marbles';
import { IAppState } from '@app/store/state/app.state';

describe('TechnicalRecordSearchComponent', () => {

  let component: TechnicalRecordSearchComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchComponent>;
  let httpMock: HttpTestingController;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
  let store: Store<IAppState>;
  let injector: TestBed;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalRecordSearchComponent ],
      imports: [
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            'https://localhost/Api/': 'xxx-xxx1-1111-x111-xxx'
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage',
        }),
        StoreModule.forRoot(appReducers),
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
      providers: [
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(TechnicalRecordSearchComponent);
    // httpMock = injector.get(HttpTestingController);
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    unsubscribe.next();
    unsubscribe.complete();
  });

  it('should create', () => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TechnicalRecordSearchComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
