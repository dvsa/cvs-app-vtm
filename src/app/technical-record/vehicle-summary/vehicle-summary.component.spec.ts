import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VehicleSummaryComponent } from '@app/technical-record/vehicle-summary/vehicle-summary.component';

describe('VehicleSummaryComponent', () => {
  let component: VehicleSummaryComponent;
  let fixture: ComponentFixture<VehicleSummaryComponent>;
  let injector: TestBed;
  let axles = [
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
      imports: [SharedModule, RouterTestingModule],
      declarations: [VehicleSummaryComponent],
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
