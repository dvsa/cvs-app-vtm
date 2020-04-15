import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

import { VehicleSummaryComponent } from '@app/technical-record/vehicle-summary/vehicle-summary.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/';
import { TechRecord } from '@app/models/tech-record.model';
import { VEHICLE_TYPES } from '@app/app.enums';
import { TechRecordHelperService } from '../tech-record-helper.service';

const getTechRecord = (): TechRecord => {
  return {
    approvalType: 'approval',
    regnDate: '2020-06-08',
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
  let techRecHelper: TechRecordHelperService;
  let techHelper: jasmine.Spy;

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
      providers: [TechRecordHelperService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    techRecHelper = TestBed.get(TechRecordHelperService);
    fixture = TestBed.createComponent(VehicleSummaryComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      ...getTechRecord()
    } as TechRecord;

    techHelper = spyOn(techRecHelper, 'isStandardVehicle');
  });

  it('should create view only with HGV populated data', () => {
    techHelper.and.returnValue(true);
    component.activeRecord.vehicleType = VEHICLE_TYPES.HGV;
    fixture.detectChanges();

    expect(techRecHelper.isStandardVehicle).toHaveBeenCalledWith(VEHICLE_TYPES.HGV);
    expect(fixture).toMatchSnapshot();
  });

  it('should create view only with TRL populated data', () => {
    techHelper.and.returnValue(true);
    component.activeRecord = {
      vehicleType: VEHICLE_TYPES.TRL,
      firstUseDate: '2019-05-16'
    } as TechRecord;
    fixture.detectChanges();

    expect(techRecHelper.isStandardVehicle).toHaveBeenCalledWith(VEHICLE_TYPES.TRL);
    expect(fixture).toMatchSnapshot();
  });

  it('should create view only with PSV populated data', () => {
    techHelper.and.returnValue(true);
    component.activeRecord = {
      vehicleType: VEHICLE_TYPES.PSV,
      seatbeltInstallationApprovalDate: '2018-05-16'
    } as TechRecord;
    fixture.detectChanges();

    expect(techRecHelper.isStandardVehicle).toHaveBeenCalledWith(VEHICLE_TYPES.PSV);
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
