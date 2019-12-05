import {async, ComponentFixture, getTestBed, inject, TestBed} from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material.module';
import {SharedModule} from '../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Store} from '@ngrx/store';
import {AuthenticationGuard, MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AuthenticationGuardMock} from '../../../../testconfig/services-mocks/authentication-guard.mock';
import {Subject} from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let httpMock: HttpTestingController;
  let injector: TestBed;
  let fixture: ComponentFixture<HeaderComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
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

  it('should create',  inject([HttpTestingController, MsAdalAngular6Service], () => {
    expect(component).toBeTruthy();
  }));
});
