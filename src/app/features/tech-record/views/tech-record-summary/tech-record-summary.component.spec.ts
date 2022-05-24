import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { TechRecordSummaryComponent } from './tech-record-summary.component';

describe('TechRecordSummaryComponent', () => {
  let component: TechRecordSummaryComponent;
  let fixture: ComponentFixture<TechRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryComponent],
      imports: [DynamicFormsModule, RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
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
    component.vehicleTechRecord = mockVehicleTechnicalRecord().techRecord.pop();
    expect(component.vehicleTechRecord?.vehicleType).toEqual('psv');
  });

  it('should get the tech record vehicle type', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop();;
    expect(component.vehicleTechRecord?.vehicleType).toEqual('trl');
  });

  it('should get the tech record vehicle type', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop();;
    expect(component.vehicleTechRecord?.vehicleType).toEqual('hgv');
  });

  it('should show record found', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord().techRecord.pop();;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const form = fixture.nativeElement.querySelector('app-dynamic-form-group');
    expect(form).toBeTruthy();
  });
});
