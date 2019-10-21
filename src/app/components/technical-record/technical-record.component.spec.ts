import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {TechnicalRecordComponent} from './technical-record.component';
import {TechnicalRecordService} from './technical-record.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {APP_BASE_HREF} from "@angular/common";
import {MsAdalAngular6Module} from "microsoft-adal-angular6";
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {TechnicalRecordServiceMock} from "../../../../test-config/services-mocks/technical-record-service.mock";
import { MaterialModule } from 'src/app/material.module';
import { IsPrimaryVrmPipe } from 'src/app/pipes/IsPrimaryVrmPipe';
import { ComponentsModule } from '../components.module';


describe('TechnicalRecordComponent', () => {
  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  let service: TechnicalRecordService;
  let qString = "YV31MEC18GA011900";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRecordComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MaterialModule,
        ComponentsModule,
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
        {provide: TechnicalRecordService, useClass: TechnicalRecordServiceMock},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MatDialogRef, useValue: {}}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalRecordComponent);
    component = fixture.componentInstance;
    service = TestBed.get(TechnicalRecordService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    service = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Service injected via inject(...) and TestBed.get(...) should be the same instance',
    inject([TechnicalRecordService], (injectService: TechnicalRecordService) => {
      expect(injectService).toBe(service);
    })
  );

  // it('should test on search tech records logic', () => {
  //   spyOn(service, "getTechnicalRecordsAllStatuses");
  //   component.searchTechRecords(qString);
  //   expect(service.getTechnicalRecordsAllStatuses).toHaveBeenCalled();
  // });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
