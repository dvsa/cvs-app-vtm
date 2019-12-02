import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';

import { TechnicalRecordSearchComponent } from './technical-record-search.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material.module';
import {SharedModule} from '../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Store, StoreModule} from '@ngrx/store';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AuthenticationGuardMock} from '../../../../test-config/services-mocks/authentication-guard.mock';
import {Subject} from 'rxjs';
import { hot } from 'jasmine-marbles';
import { initialVehicleTechRecordModelState } from "@app/store/state/VehicleTechRecordModel.state";
import {IAppState} from "@app/store/state/adrDetailsForm.state";
import {appReducers} from "@app/store/reducers/app.reducers";
import {adrDetailsReducer} from "@app/store/reducers/adrDetailsForm.reducer";


describe('TechnicalRecordSearchComponent', () => {

  let component: TechnicalRecordSearchComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
  let store: Store<IAppState>;
  let injector: TestBed;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule,
        StoreModule.forFeature('adrDetails', adrDetailsReducer)
      ],
      declarations: [ TechnicalRecordSearchComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: initialVehicleTechRecordModelState })),
            select: jest.fn()
          }
        },
        {provide: AuthenticationGuard, useValue: authenticationGuardMock},
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
      store = TestBed.get(Store);
      spyOn(store, 'dispatch').and.callThrough();
      fixture = TestBed.createComponent(TechnicalRecordSearchComponent);
      injector = getTestBed();
      component = fixture.componentInstance;
      fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
    unsubscribe.next();
    unsubscribe.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
