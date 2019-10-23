import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {TechnicalRecordComponent} from './technical-record.component';
import {TechnicalRecordService} from './technical-record.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {APP_BASE_HREF} from '@angular/common';
import {AuthenticationGuard, MsAdalAngular6Module} from 'microsoft-adal-angular6';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MaterialModule} from '../../material.module';
import {ComponentsModule} from '../components.module';
import {IsPrimaryVrmPipe} from '../../pipes/IsPrimaryVrmPipe';
import {PipeModule} from '../../pipe.module';
import {Store} from '@ngrx/store';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationGuardMock} from '../../../../test-config/services-mocks/authentication-guard.mock';

describe('TechnicalRecordComponent', () => {

  it('fake test', () => {
    expect(true);
  });

  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  let store: MockStore<{
    vehicleTechRecordModel: any,
    selectedVehicleTechRecordModel: any
  }>;
  const initialState = {
    vehicleTechRecordModel: null,
    selectedVehicleTechRecordModel: null
  };

  const authenticationGuardMock = new AuthenticationGuardMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRecordComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MaterialModule,
        PipeModule,
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
        provideMockStore({initialState}),
        {provide: AuthenticationGuard, useValue: authenticationGuardMock},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MatDialogRef, useValue: {}}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
