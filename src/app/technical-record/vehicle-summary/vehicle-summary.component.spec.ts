import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { appReducers } from '@app/store/reducers/app.reducers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgrxFormsModule } from 'ngrx-forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VehicleSummaryComponent } from '@app/technical-record/vehicle-summary/vehicle-summary.component';
import { TechnicalRecordComponent } from '@app/technical-record/technical-record.component';

describe('VehicleSummaryComponent', () => {
  let component: VehicleSummaryComponent;
  let fixture: ComponentFixture<VehicleSummaryComponent>;
  let injector: TestBed;
  const axles = [
    {
      parkingBrakeMrk: false,
      axleNumber: 1
    },
    {
      parkingBrakeMrk: true,
      axleNumber: 2
    }
  ];

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
      declarations: [VehicleSummaryComponent, TechnicalRecordComponent],
      providers: [TechRecordHelpersService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSummaryComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = {
      vin: 'XMGDE02FS0H012345',
      vehicleSize: 'small',
      testStationName: 'Rowe, Wunsch and Wisoky',
      vehicleId: 'JY58FPP',
      vehicleType: 'psv',
      axles: [
        { parkingBrakeMrk: false, axleNumber: 1 },
        { parkingBrakeMrk: true, axleNumber: 2 },
        { parkingBrakeMrk: false, axleNumber: 3 }
      ]
    };
    component.axlesHasNoParkingBrakeMrk(axles);

    fixture.detectChanges();
  });

  it('should create my component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should check if axles has no parking brake mrk', () => {
    component.axlesHasNoParkingBrakeMrk(axles);
    for (const axle of axles) {
      if (axle.parkingBrakeMrk === true) {
        expect(component.axlesHasNoParkingBrakeMrk(axles)).toBeFalsy();
      }
    }
  });

  it('should return true if the axles has no parking brake when called', () => {
    expect(component.axlesHasNoParkingBrakeMrk([])).toBe(true);
  });

  it('should return false if one of the axles have parking brake when called', () => {
    expect(component.axlesHasNoParkingBrakeMrk(axles)).toBe(false);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
