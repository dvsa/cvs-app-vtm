import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TechnicalRecordComponent} from './technical-record.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {APP_BASE_HREF} from '@angular/common';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {MatDialogModule} from '@angular/material/dialog';
import {MaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthenticationGuardMock} from '../../../../test-config/services-mocks/authentication-guard.mock';
import {Store, StoreModule, combineReducers} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../shared/shared.module';
import { GetVehicleTechRecordModelHavingStatusAll } from '../../store/actions/VehicleTechRecordModel.actions';
import {GetVehicleTestResultModel} from '../../store/actions/VehicleTestResultModel.actions';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import { IAppState } from '@app/store/state/app.state';
import { appReducers } from '@app/store/reducers/app.reducers';

describe('TechnicalRecordComponent', () => {

  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
  let store: Store<IAppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [TechnicalRecordComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(),
            select: jest.fn()
          }
        },
        {provide: AuthenticationGuard, useValue: authenticationGuardMock},
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
      store = TestBed.get(Store);
      spyOn(store, 'dispatch').and.callThrough();
      fixture = TestBed.createComponent(TechnicalRecordComponent);
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
    fixture.detectChanges();
    const spy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should toggle panel open state', () => {
    component.togglePanel();
    for (const panel of component.panels) {
      expect(panel.isOpened).toEqual(true);
    }
  });

  it('should dispatch the actions from searchTechRecords action',  () => {
    const q = '123455677';
    component.searchTechRecords(q);
    const statusAllAction = new GetVehicleTechRecordModelHavingStatusAll(q);
    const testResultModelAction = new GetVehicleTestResultModel(q);
    const store = TestBed.get(Store);
    const spy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(statusAllAction);
    expect(spy).toHaveBeenCalledWith(testResultModelAction);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
