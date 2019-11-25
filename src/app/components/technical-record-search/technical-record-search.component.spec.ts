import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
import {GetVehicleTechRecordModelHavingStatusAll} from "@app/store/actions/VehicleTechRecordModel.actions";
import {GetVehicleTestResultModel} from "@app/store/actions/VehicleTestResultModel.actions";
import {TechnicalRecordComponent} from "@app/components/technical-record/technical-record.component";
import {appReducers} from "@app/store/reducers/app.reducers";
import {IAppState} from "@app/store/state/app.state";

describe('TechnicalRecordSearchComponent', () => {
  let component: TechnicalRecordSearchComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
  let store: Store<IAppState>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalRecordSearchComponent],
      imports: [
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule
      ],
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
    })
    .compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TechnicalRecordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalRecordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    unsubscribe.next();
    unsubscribe.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should dispatch the actions from searchTechRecords action',  () => {
  //   const q = '123455677';
  //   const statusAllAction = new GetVehicleTechRecordModelHavingStatusAll(q);
  //   const testResultModelAction = new GetVehicleTestResultModel(q);
  //   const store = TestBed.get(Store);
  //   const spy = jest.spyOn(store, 'dispatch');
  //   fixture.detectChanges();
  //   expect(spy).toHaveBeenCalledWith(statusAllAction);
  // });


});
