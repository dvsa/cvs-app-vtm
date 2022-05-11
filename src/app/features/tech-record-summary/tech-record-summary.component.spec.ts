import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { DynamicFormsModule } from 'src/app/forms/dynamic-forms.module';
import { TechRecordSummaryComponent } from './tech-record-summary.component';

describe('TechRecordSummaryComponent', () => {
  let component: TechRecordSummaryComponent;
  let fixture: ComponentFixture<TechRecordSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryComponent],
      imports: [DynamicFormsModule]
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

  it('should show record found', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
    expect(heading).toBeFalsy();

    const form = fixture.nativeElement.querySelector('app-dynamic-form-group');
    expect(form).toBeTruthy();
  });
});
