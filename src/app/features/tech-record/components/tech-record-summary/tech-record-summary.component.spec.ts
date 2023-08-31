import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { LettersComponent } from '@forms/custom-sections/letters/letters.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { createMockTrl } from '@mocks/trl-record.mock';
import { Roles } from '@models/roles.enum';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { State, initialAppState } from '@store/index';
import { editableVehicleTechRecord, updateEditingTechRecord } from '@store/technical-records';
import { of } from 'rxjs';
import { TechRecordSummaryComponent } from './tech-record-summary.component';

describe('TechRecordSummaryComponent', () => {
  let component: TechRecordSummaryComponent;
  let fixture: ComponentFixture<TechRecordSummaryComponent>;
  let store: MockStore<State>;
  let techRecordService: TechnicalRecordService;

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
        },
        TechnicalRecordService
      ]
    })
      .overrideComponent(LettersComponent, {
        set: {
          selector: 'app-letters',
          template: `<p>Mock Letters Component</p>`
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechRecordSummaryComponent);
    store = TestBed.inject(MockStore);
    techRecordService = TestBed.inject(TechnicalRecordService);
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
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!));
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show PSV record found without dimensions', () => {
      component.isEditing = false;
      const mockTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      mockTechRecord.dimensions = undefined;
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockTechRecord));
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show HGV record found', () => {
      component.isEditing = false;
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop()!));
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show HGV record found without dimensions', () => {
      component.isEditing = false;
      const mockTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop()!;
      mockTechRecord.dimensions = undefined;
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockTechRecord));
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show TRL record found', async () => {
      component.isEditing = false;
      const mockTechRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop()!;
      mockTechRecord.dimensions = undefined;
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockTechRecord));
      fixture.detectChanges();
      component.letters.vehicle = createMockTrl(12345);
      await fixture.whenStable();

      checkHeadingAndForm();
    });

    it('should show TRL record found without dimensions', () => {
      component.isEditing = false;
      const mockTechRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop()!;
      mockTechRecord.dimensions = undefined;
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockTechRecord));
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });

  describe('TechRecordSummaryComponent Amend', () => {
    it('should make reason for change null in editMode', () => {
      component.isEditing = true;
      const mockTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockTechRecord));
      fixture.detectChanges();

      checkHeadingAndForm();
    });
  });

  describe('handleFormState', () => {
    it('should dispatch updateEditingTechRecord', () => {
      jest.spyOn(component, 'checkForms').mockImplementation();
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord.pop()!;
      const mockTechRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord.pop()!;
      jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockTechRecord));
      component.sections = new QueryList<DynamicFormGroupComponent>();

      store.overrideSelector(editableVehicleTechRecord, { vrms: [], vin: '', systemNumber: '', techRecord: [] });

      component.handleFormState({});

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateEditingTechRecord({ vehicleTechRecord: { vin: '', vrms: [], systemNumber: '', techRecord: [component.techRecordCalculated!] } })
      );
    });
  });

  describe('handlePsvClassChange', () => {
    it('should change the psv size to small when the vehicle class is changed to small psv', () => {
      component.techRecordCalculated = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.LARGE
      };

      component.handlePsvClassChange(VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats);
      fixture.detectChanges();

      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.SMALL);
    });
    it('should change the psv size to large when the vehicle class is changed to large psv', () => {
      component.techRecordCalculated = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats,
          code: VehicleClass.CodeEnum.S
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL
      };

      component.handlePsvClassChange(VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats);
      fixture.detectChanges();

      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.LARGE);
    });
    it('should not change the vehicle size if class is changed to one other than the psv sizes', () => {
      component.techRecordCalculated = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats,
          code: VehicleClass.CodeEnum.S
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL
      };

      component.handlePsvClassChange(VehicleClass.DescriptionEnum.MotorbikesOver200ccOrWithASidecar);
      fixture.detectChanges();

      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.SMALL);
    });
  });

  describe('handlePsvSizeChange', () => {
    it('should change the vehicle class to small if vehicle size changed', () => {
      component.techRecordCalculated = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.LARGE
      };

      component.handlePsvSizeChange(VehicleSizes.SMALL);
      fixture.detectChanges();

      expect(component.techRecordCalculated.vehicleClass?.description).toBe(VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats);
    });
    it('should change the vehicle class to large if vehicle size changed', () => {
      component.techRecordCalculated = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL
      };

      component.handlePsvSizeChange(VehicleSizes.LARGE);
      fixture.detectChanges();

      expect(component.techRecordCalculated.vehicleClass?.description).toBe(VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats);
    });
  });

  describe('handlePsvPassengersChange', () => {
    it('should calculate the vehicle size and description based on passenger numbers', () => {
      component.techRecordCalculated = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL
      };

      component.handlePsvPassengersChange(10, 5, 13);
      expect(component.techRecordCalculated.vehicleClass?.description).toBe(VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats);
      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.LARGE);
    });
    it('should calculate the vehicle size and description based on passenger numbers', () => {
      component.techRecordCalculated = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL
      };

      component.handlePsvPassengersChange(1, 2, 19);
      expect(component.techRecordCalculated.vehicleClass?.description).toBe(VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats);
      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.SMALL);
    });
  });

  describe('psvSizeCalculator', () => {
    it('should call handlePsvClassChange when event changes the class', () => {
      const record = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL
      };
      component.techRecordCalculated = record;

      const expectedRecord = {
        ...record,
        vehicleClass: { description: VehicleClass.DescriptionEnum.SmallPsvIeLessThanOrEqualTo22Seats, code: VehicleClass.CodeEnum.L }
      };

      const methodSpy = jest.spyOn(component, 'handlePsvClassChange');
      component.psvSizeCalculator(expectedRecord, record);
      fixture.detectChanges();

      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.SMALL);
      expect(methodSpy).toHaveBeenCalled();
    });
    it('should call handlePsvSize when event changes the size', () => {
      const record = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL
      };
      component.techRecordCalculated = record;

      const expectedRecord = { ...record, vehicleSize: VehicleSizes.LARGE };

      const methodSpy = jest.spyOn(component, 'handlePsvSizeChange');
      component.psvSizeCalculator(expectedRecord, record);
      fixture.detectChanges();

      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.SMALL);
      expect(methodSpy).toHaveBeenCalled();
    });
    it('should call handlePsvPassengersChange when event changes the class', () => {
      const record = {
        vehicleClass: {
          description: VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats,
          code: VehicleClass.CodeEnum.L
        },
        createdAt: new Date(),
        vehicleType: VehicleTypes.PSV,
        vehicleSize: VehicleSizes.SMALL,
        seatsLowerDeck: 3,
        standingCapacity: 4
      };
      component.techRecordCalculated = record;

      const expectedRecord = { ...record, seatsUpperDeck: 18 };

      const methodSpy = jest.spyOn(component, 'handlePsvPassengersChange');
      component.psvSizeCalculator(expectedRecord, record);
      fixture.detectChanges();

      expect(methodSpy).toHaveBeenCalled();
      expect(component.techRecordCalculated.vehicleSize).toBe(VehicleSizes.LARGE);
      expect(component.techRecordCalculated.vehicleClass?.description).toBe(VehicleClass.DescriptionEnum.LargePsvIeGreaterThan23Seats);
    });
  });
});
