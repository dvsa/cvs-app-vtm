import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { PsvBrakesComponent } from './psv-brakes.component';

describe('PsvBrakesComponent', () => {
  let component: PsvBrakesComponent;
  let fixture: ComponentFixture<PsvBrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PsvBrakesComponent],
      imports: [DynamicFormsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        MultiOptionsService,
        provideMockStore({ initialState: initialAppState }),
        ReferenceDataService,
        { provide: UserService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsvBrakesComponent);
    component = fixture.componentInstance;

    component.vehicleTechRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('The brake code value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_brakes_brakeCode).toStrictEqual(component.form.value.techRecord_brakes_brakeCode);
    });
  });
  describe('The dataTrBrakeOne value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_brakes_retarderBrakeOne).toStrictEqual(component.form.value.techRecord_brakes_retarderBrakeOne);
    });
  });
  describe('The brakeCodeOriginal value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_brakes_brakeCodeOriginal).toStrictEqual(
        component.form.controls['techRecord_brakes_brakeCodeOriginal']?.value
      );
    });
  });

  describe('The axle value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_axles![0]).toEqual(
        expect.objectContaining(component.form.controls['techRecord_axles']?.value[0])
      );
    });
  });
});
