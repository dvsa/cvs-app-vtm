import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalRecordSearchComponent } from './technical-record-search.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material.module';
import {SharedModule} from '../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Store} from '@ngrx/store';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AuthenticationGuardMock} from '../../../../test-config/services-mocks/authentication-guard.mock';
import {Subject} from 'rxjs';

describe('TechnicalRecordSearchComponent', () => {
  let component: TechnicalRecordSearchComponent;
  let fixture: ComponentFixture<TechnicalRecordSearchComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalRecordSearchComponent],
      imports: [
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
});
