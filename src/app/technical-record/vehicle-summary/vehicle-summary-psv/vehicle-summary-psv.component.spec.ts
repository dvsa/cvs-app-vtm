import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSummaryPsvComponent } from './vehicle-summary-psv.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('PsvVehicleSummaryComponent', () => {
  let component: VehicleSummaryPsvComponent;
  let fixture: ComponentFixture<VehicleSummaryPsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VehicleSummaryPsvComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSummaryPsvComponent);
    component = fixture.componentInstance;
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      approvalType: 'approval',
      variantNumber: '123',
      ntaNumber: '4566',
      speedLimiterMrk: true,
      tachoExemptMrk: true,
      euroStandard: '6',
      fuelPropulsionSystem: 'gas',
      numberOfWheelsDriven: 4,
      emissionsLimit: 23,
      vehicleClass: { code: '2', description: 'motorbikes over 200cc' }
    });
    component.activeRecord.axles = [TESTING_UTILS.mockAxle()];
  }));

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
