import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

import { VehicleSummaryComponent } from '@app/technical-record/vehicle-summary/vehicle-summary.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/';
import { TechRecord } from '@app/models/tech-record.model';
import { VEHICLE_TYPES } from '@app/app.enums';

const getTechRecord = (): TechRecord => {
  return {
    approvalType: 'approval',
    regnDate: '12312321',
    manufactureYear: 2003,
    euVehicleCategory: '3',
    departmentalVehicleMarker: true,
    vehicleClass: { code: '2', description: 'motorbikes over 200cc' },
    axles: [TESTING_UTILS.mockAxle()]
  } as TechRecord;
};

describe('VehicleSummaryComponent', () => {
  let component: VehicleSummaryComponent;
  let fixture: ComponentFixture<VehicleSummaryComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        VehicleSummaryComponent,
        TestVehicleSummaryHgvComponent,
        TestVehicleSummaryTrlComponent,
        TestVehicleSummaryPsvComponent,
        TestVehicleSummaryEditComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSummaryComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      ...getTechRecord()
    } as TechRecord;
  });

  it('should create view only with HGV populated data', () => {
    component.activeRecord.vehicleType = VEHICLE_TYPES.HGV;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create view only with TRL populated data', () => {
    component.activeRecord.vehicleType = VEHICLE_TYPES.TRL;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should create view only with PSV populated data', () => {
    component.activeRecord.vehicleType = VEHICLE_TYPES.PSV;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should check if axles has no parking brake mrk', () => {
    fixture.detectChanges();

    expect(component.axlesHasParkingBrakeMrk()).toBeTruthy();
  });

  it('should render the editable component if editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
@Component({
  selector: 'vtm-vehicle-summary-hgv',
  template: `
    <div>HGV active record is: {{ activeRecord | json }}</div>
  `
})
class TestVehicleSummaryHgvComponent {
  @Input() activeRecord: TechRecord;
}

@Component({
  selector: 'vtm-vehicle-summary-trl',
  template: `
    <div>TRL active record is: {{ activeRecord | json }}</div>
  `
})
class TestVehicleSummaryTrlComponent {
  @Input() activeRecord: TechRecord;
}

@Component({
  selector: 'vtm-vehicle-summary-psv',
  template: `
    <div>PSV active record is: {{ activeRecord | json }}</div>
  `
})
class TestVehicleSummaryPsvComponent {
  @Input() activeRecord: TechRecord;
}

@Component({
  selector: 'vtm-vehicle-summary-edit',
  template: `
    <div>active record is: {{ techRecord | json }}</div>
  `
})
class TestVehicleSummaryEditComponent {
  @Input() techRecord: TechRecord;
}
