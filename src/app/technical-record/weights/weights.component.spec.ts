import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WeightsComponent } from '@app/technical-record/weights/weights.component';

describe('WeightsComponent', () => {
  let component: WeightsComponent;
  let fixture: ComponentFixture<WeightsComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [WeightsComponent],
      providers: [TechRecordHelpersService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WeightsComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = {
      vin: 'XMGDE02FS0H012345',
      vehicleSize: 'small',
      testStationName: 'Rowe, Wunsch and Wisoky',
      vehicleId: 'JY58FPP',
      vehicleType: 'psv',
      grossGbWeight: 100,
      grossDesignWeight: 100,
      trainGbWeight: 100,
      trainDesignWeight: 100,
      maxTrainGbWeight: 100,
      maxTrainDesignWeight: 100,
      axles: [
        { parkingBrakeMrk: false, axleNumber: 1, weights: { gbWeight: 100, designWeight: 100 } },
        { parkingBrakeMrk: true, axleNumber: 2, weights: { gbWeight: 100, designWeight: 100 } },
        { parkingBrakeMrk: false, axleNumber: 3, weights: { gbWeight: 100, designWeight: 100 } }
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
