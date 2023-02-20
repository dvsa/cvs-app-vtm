import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { LettersComponent } from '@forms/custom-sections/letters/letters.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord, mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { createMockTrl } from '@mocks/trl-record.mock';
import { Roles } from '@models/roles.enum';
import { LettersOfAuth, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/index';
import { editableVehicleTechRecord, updateEditingTechRecord } from '@store/technical-records';
import { of } from 'rxjs';
import { TechRecordSummaryComponent } from './tech-record-summary.component';

describe('TechRecordSummaryComponent', () => {
  let component: TechRecordSummaryComponent;
  let fixture: ComponentFixture<TechRecordSummaryComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [
        MultiOptionsService,
        provideMockStore({ initialState: initialAppState }),
        {
          provide: UserService,
          useValue: {
            roles$: of([Roles.TechRecordAmend])
          }
        }
      ]
    })
      .overrideComponent(LettersComponent, {
        set: {
          selector: 'app-letters',
          template: `<h6>Mock Letters Component</h6>`
        }
      })
      .compileComponents();
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
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show PSV record found without dimensions', () => {
      component.isEditing = false;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      component.techRecord!.dimensions = undefined;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show HGV record found', () => {
      component.isEditing = false;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show HGV record found without dimensions', () => {
      component.isEditing = false;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop()!;
      component.techRecord!.dimensions = undefined;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show TRL record found', async () => {
      component.isEditing = false;
      component.techRecord = {
        ...createMockTrl(12345).techRecord[0],
        letterOfAuth: {} as LettersOfAuth
      };
      fixture.detectChanges();
      component.letters.vehicle = createMockTrl(12345);
      await fixture.whenStable();

      checkHeadingAndForm();
    });

    it('should show TRL record found without dimensions', () => {
      component.isEditing = false;
      component.techRecord = {
        ...createMockTrl(12345).techRecord[0],
        letterOfAuth: {} as LettersOfAuth
      };
      component.techRecord!.dimensions = undefined;
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });

  describe('TechRecordSummaryComponent Amend', () => {
    it('should make reason for change null in editMode', () => {
      component.isEditing = true;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });

  describe('handleFormState', () => {
    it('should dispatch updateEditingTechRecord', () => {
      jest.spyOn(component, 'checkForms').mockImplementation();
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      component.sections = new QueryList<DynamicFormGroupComponent>();

      store.overrideSelector(editableVehicleTechRecord, { vrms: [], vin: '', systemNumber: '', techRecord: [] });

      component.handleFormState({});

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateEditingTechRecord({ vehicleTechRecord: { vin: '', vrms: [], systemNumber: '', techRecord: [component.techRecordCalculated!] } })
      );
    });
  });
});
