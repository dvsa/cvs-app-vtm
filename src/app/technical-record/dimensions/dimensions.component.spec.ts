import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import { StoreModule} from '@ngrx/store';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {appReducers} from '@app/store/reducers/app.reducers';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@app/material.module';
import {SharedModule} from '@app/shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgrxFormsModule} from 'ngrx-forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TechnicalRecordComponent} from '@app/technical-record/technical-record.component';
import {DimensionsComponent} from '@app/technical-record/dimensions/dimensions.component';

describe('DimensionsComponent', () => {

  let component: DimensionsComponent;
  let fixture: ComponentFixture<DimensionsComponent>;
  let injector: TestBed;

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
        RouterTestingModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        NgrxFormsModule
      ],
      declarations: [DimensionsComponent, TechnicalRecordComponent],
      providers: [
        TechRecordHelpersService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

    fixture = TestBed.createComponent(DimensionsComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = {
      'vin': 'XMGDE02FS0H012345',
      'vehicleSize': 'small',
      'testStationName': 'Rowe, Wunsch and Wisoky',
      'vehicleId': 'JY58FPP',
      'vehicleType': 'psv',
      'dimensions': { 'length': 100, 'width': 100},
      'frontAxleToRearAxle': 100,
      'rearAxleToRearTrl': 100,
      'frontAxleTo5thWheelCouplingMin': 100,
      'frontAxleTo5thWheelCouplingMax': 100,
      'frontAxleTo5thWheelMin': 100,
      'frontAxleTo5thWheelMax': 100,
      'couplingCenterToRearAxleMin': 100,
      'couplingCenterToRearAxleMax': 100,
      'couplingCenterToRearTrlMin': 100,
      'couplingCenterToRearTrlMax': 100,
      'axles': [
        { 'parkingBrakeMrk': false, 'axleNumber': 1 },
        { 'parkingBrakeMrk': true, 'axleNumber': 2 },
        { 'parkingBrakeMrk': false, 'axleNumber': 3 }
      ]
    };

    fixture.detectChanges();
  });

  it('should create my component', async(() => {
    expect(component).toBeTruthy();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
