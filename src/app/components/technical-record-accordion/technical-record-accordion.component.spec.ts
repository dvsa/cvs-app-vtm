import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalRecordAccordionComponent } from './technical-record-accordion.component';
import {Store} from "@ngrx/store";
import {AuthenticationGuard} from "microsoft-adal-angular6";
import {APP_BASE_HREF} from "@angular/common";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {AuthenticationGuardMock} from "../../../../test-config/services-mocks/authentication-guard.mock";

describe('TechnicalRecordAccordionComponent', () => {
  let component: TechnicalRecordAccordionComponent;
  let fixture: ComponentFixture<TechnicalRecordAccordionComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalRecordAccordionComponent ],
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
    fixture = TestBed.createComponent(TechnicalRecordAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
