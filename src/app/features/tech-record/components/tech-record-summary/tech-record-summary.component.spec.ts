import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { TechRecordSummaryComponent } from './tech-record-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TechRecordSummaryComponent', () => {
  let component: TechRecordSummaryComponent;
  let fixture: ComponentFixture<TechRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryComponent],
      imports: [DynamicFormsModule, RouterTestingModule, HttpClientTestingModule],
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

  function checkHeadingAndForm(): void {
    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const form = fixture.nativeElement.querySelector('app-dynamic-form-group');
    expect(form).toBeTruthy();
  }

  describe( 'TechRecordSummaryComponent View', () => {

    it('should show PSV record found', () => {
      component.isEditable = false
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop();
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show HGV record found', () => {
      component.isEditable = false
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop();
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show TRL record found', () => {
      component.isEditable = false
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop();
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });

  describe( 'TechRecordSummaryComponent Amend', () => {
    it('should make reason for change null in editMode', () => {
      component.isEditable = true;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop();
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });
});

