import { TechRecordSummaryComponent } from './tech-record-summary.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechRecordModel, VehicleTypes, StatusCodes, FuelTypes, VehicleConfigurations, EuVehicleCategories, VehicleSizes } from '@models/vehicle-tech-record.model';
import { By } from '@angular/platform-browser';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { HgvTechRecord } from 'src/app/forms/templates/hgv/hgv-tech-record.template';

describe('TechRecordSummaryComponent', () => {
  let component: TechRecordSummaryComponent;
  let fixture: ComponentFixture<TechRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the tech record vehicle type', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    expect(component.vehicleType).toEqual('psv');
  });

  it('should get the tech record vehicle type', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL);
    expect(component.vehicleType).toEqual('trl');
  });

  it('should get the tech record vehicle type', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV);
    expect(component.vehicleType).toEqual('hgv');
  });

  it('should show record found', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const form = fixture.nativeElement.querySelector('app-dynamic-form-group');
    expect(form).toBeTruthy();
  });
});
