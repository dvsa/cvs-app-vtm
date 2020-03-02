import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DimensionsComponent } from '@app/technical-record/dimensions/dimensions.component';

describe('DimensionsComponent', () => {
  let component: DimensionsComponent;
  let fixture: ComponentFixture<DimensionsComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [DimensionsComponent],
      providers: [TechRecordHelpersService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DimensionsComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = {
      vin: 'XMGDE02FS0H012345',
      vehicleSize: 'small',
      testStationName: 'Rowe, Wunsch and Wisoky',
      vehicleId: 'JY58FPP',
      vehicleType: 'psv',
      dimensions: { length: 100, width: 100 },
      frontAxleToRearAxle: 100,
      rearAxleToRearTrl: 100,
      frontAxleTo5thWheelCouplingMin: 100,
      frontAxleTo5thWheelCouplingMax: 100,
      frontAxleTo5thWheelMin: 100,
      frontAxleTo5thWheelMax: 100,
      couplingCenterToRearAxleMin: 100,
      couplingCenterToRearAxleMax: 100,
      couplingCenterToRearTrlMin: 100,
      couplingCenterToRearTrlMax: 100,
      axles: [
        { parkingBrakeMrk: false, axleNumber: 1 },
        { parkingBrakeMrk: true, axleNumber: 2 },
        { parkingBrakeMrk: false, axleNumber: 3 }
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
