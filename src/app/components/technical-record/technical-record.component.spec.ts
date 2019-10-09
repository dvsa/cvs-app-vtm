import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicalRecordComponent } from './technical-record.component';
import { TechnicalRecordService } from './technical-record.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {APP_BASE_HREF} from "@angular/common";
import {MsAdalAngular6Module} from "microsoft-adal-angular6";

describe('TechnicalRecordComponent', () => {
  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations:[TechnicalRecordComponent],
      imports: [
        HttpClientTestingModule,
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            "https://localhost/Api/": "xxx-xxx1-1111-x111-xxx"
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage',
        })
      ],
      providers: [
        TechnicalRecordService,
        { provide: APP_BASE_HREF, useValue : '/' }
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalRecordComponent);
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
