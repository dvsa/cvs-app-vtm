import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

import { VehicleSummaryComponent } from '@app/technical-record/vehicle-summary/vehicle-summary.component';
import { TechRecord } from '@app/models/tech-record.model';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '../../utils/testing.utils';

describe('VehicleSummaryComponent', () => {
  let component: VehicleSummaryComponent;
  let fixture: ComponentFixture<VehicleSummaryComponent>;
  let injector: TestBed;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VehicleSummaryComponent, TestVehicleSummaryEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSummaryComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      approvalType: 'approval',
      variantNumber: '123',
      ntaNumber: '4566',
      vehicleClass: TESTING_UTILS.mockBodyType()
    });
    component.activeRecord.axles = [TESTING_UTILS.mockAxle()];
  });

  it('should create view only with populated data', () => {
    component.editState = false;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should check if axles has no parking brake mrk', () => {
    expect(component.axlesHasParkingBrakeMrk()).toBeTruthy();
  });

  it('should check if axles has no parking brake mrk', () => {
    expect(component.formatVehicleClassDescription()).toEqual(
      'The first letter should be capital'
    );
  });

  it('should create format the vehicle class description', () => {
    fixture.detectChanges();
    expect(component.vehicleClassDescription).toEqual('The first letter should be capital');
  });

  it('should render the editable component if editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-vehicle-summary-edit',
  template: `
    <div>active record is: {{ activeRecord | json }}</div>
  `
})
class TestVehicleSummaryEditComponent {
  @Input() activeRecord: TechRecord;
}
