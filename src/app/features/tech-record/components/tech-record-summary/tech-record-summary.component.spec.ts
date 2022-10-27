import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { TechRecordSummaryComponent } from './tech-record-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { updateEditingTechRecord } from '@store/technical-records';
import { SharedModule } from '@shared/shared.module';

describe('TechRecordSummaryComponent', () => {
  let component: TechRecordSummaryComponent;
  let fixture: ComponentFixture<TechRecordSummaryComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordSummaryComponent);
    store = TestBed.inject(MockStore);
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

  describe('TechRecordSummaryComponent View', () => {
    it('should show PSV record found', () => {
      component.isEditing = false;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show PSV record found without dimensions', () => {
      component.isEditing = false;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      component.vehicleTechRecord!.dimensions = undefined;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show HGV record found', () => {
      component.isEditing = false;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show HGV record found without dimensions', () => {
      component.isEditing = false;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop()!;
      component.vehicleTechRecord!.dimensions = undefined;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show TRL record found', () => {
      component.isEditing = false;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show TRL record found without dimensions', () => {
      component.isEditing = false;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop()!;
      component.vehicleTechRecord!.dimensions = undefined;
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });

  describe('TechRecordSummaryComponent Amend', () => {
    it('should make reason for change null in editMode', () => {
      component.isEditing = true;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });

  describe('handleFormState', () => {
    it('should dispatch updateEditingTechRecord', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.vehicleTechRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      component.vehicleTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;

      component.handleFormState({});

      expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ techRecord: component.vehicleTechRecordCalculated! }));
    });
  });
});
