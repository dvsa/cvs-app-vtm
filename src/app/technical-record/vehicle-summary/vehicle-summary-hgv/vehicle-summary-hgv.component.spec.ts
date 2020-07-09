import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSummaryHgvComponent } from './vehicle-summary-hgv.component';
import { SharedModule } from '@app/shared/shared.module';
import { TechRecord } from '@app/models/tech-record.model';

describe('VehicleSummaryHgvComponent', () => {
  let component: VehicleSummaryHgvComponent;
  let fixture: ComponentFixture<VehicleSummaryHgvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VehicleSummaryHgvComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSummaryHgvComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      vehicleType: 'hgv',
      drawbarCouplingFitted: true,
      offRoad: false,
      speedLimiterMrk: true,
      tachoExemptMrk: true,
      euroStandard: '6',
      fuelPropulsionSystem: 'gas',
      numberOfWheelsDriven: 4,
      emissionsLimit: 23
    } as TechRecord;
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
