import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicalRecordComponent } from './technical-record.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationGuardMock } from '../../../../test-config/services-mocks/authentication-guard.mock';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import {SharedModule} from '../../shared/shared.module';

describe('TechnicalRecordComponent', () => {

  it('fake test', () => {
    expect(true);
  });

  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRecordComponent],
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
        { provide: AuthenticationGuard, useValue: authenticationGuardMock },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
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
