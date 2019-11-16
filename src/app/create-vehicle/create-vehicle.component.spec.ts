import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MaterialModule} from '../material.module';
import {CreateVehicleComponent} from './create-vehicle.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MsAdalAngular6Module} from 'microsoft-adal-angular6';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TechnicalRecordServiceMock} from '../../../test-config/services-mocks/technical-record-service.mock';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details.component';
import { TechnicalRecordService } from '../components/technical-record/technical-record.service';
import { LandingPageComponent } from '../landing-page/landing-page.component';


describe('CreateVehicleComponent', () => {
  let component: CreateVehicleComponent;
  let fixture: ComponentFixture<CreateVehicleComponent>;
  let techRecService: TechnicalRecordService;
  const vehicleData = { vehicleType: 'hgv',  vin: 'XMGDE02FS0H012345', vrm: '3424' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateVehicleComponent, VehicleDetailsComponent, LandingPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        AppRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
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
        {provide: TechnicalRecordService, useClass: TechnicalRecordServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVehicleComponent);
    component = fixture.componentInstance;
    techRecService = TestBed.get(TechnicalRecordService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    techRecService = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should test on submit logic', () => {
    spyOn(techRecService, 'getTechnicalRecords');
    component.onSubmit(vehicleData);
    expect(techRecService.getTechnicalRecords).toHaveBeenCalled();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
