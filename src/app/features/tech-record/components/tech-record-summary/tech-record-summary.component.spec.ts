import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { Axle, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { TechRecordSummaryComponent } from './tech-record-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { editableVehicleTechRecord, updateEditingTechRecord } from '@store/technical-records';
import { SharedModule } from '@shared/shared.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { QueryList } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { UserService } from '@services/user-service/user-service';
import { of } from 'rxjs';
import { Roles } from '@models/roles.enum';

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

    it('should show TRL record found', () => {
      component.isEditing = false;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop()!;
      fixture.detectChanges();

      checkHeadingAndForm();
    });

    it('should show TRL record found without dimensions', () => {
      component.isEditing = false;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.TRL).techRecord.pop()!;
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

  describe('findAxleToRemove', () => {
    it('should find first axle and remove', () => {
      const axles: Axle[] = [
        {
          axleNumber: 2
        },
        {
          axleNumber: 3
        },
        {
          axleNumber: 4
        }
      ];

      expect(component.findAxleToRemove(axles)).toBe(1);
    });

    it('should find a middle axle and remove', () => {
      const axles: Axle[] = [
        {
          axleNumber: 1
        },
        {
          axleNumber: 3
        },
        {
          axleNumber: 4
        }
      ];

      expect(component.findAxleToRemove(axles)).toBe(2);
    });

    it('should find last axle and remove', () => {
      const axles: Axle[] = [
        {
          axleNumber: 1
        },
        {
          axleNumber: 2
        },
        {
          axleNumber: 3
        }
      ];

      expect(component.findAxleToRemove(axles)).toBe(4);
    });
  });

  describe('addAxle', () => {
    it('should add an axle', () => {
      component.isEditing = true;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];

      const axleEvent = {
        axles: [
          {
            axleNumber: 1
          },
          {
            axleNumber: 2
          },
          {
            axleNumber: 3
          }
        ]
      };

      component.addAxle(axleEvent);

      expect(component.techRecordCalculated.axles!.length).toBe(3);
      expect(component.techRecordCalculated.dimensions?.axleSpacing?.length).toBe(2);
    });

    it('should add an axle on a psv', () => {
      component.isEditing = true;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord[0];
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord[0];

      const axleEvent = {
        axles: [
          {
            axleNumber: 1
          },
          {
            axleNumber: 2
          },
          {
            axleNumber: 3
          },

          {
            axleNumber: 4
          }
        ]
      };

      component.addAxle(axleEvent);

      expect(component.techRecordCalculated.axles!.length).toBe(4);
    });
  });

  describe('removeAxle', () => {
    it('should remove axle on psv', () => {
      component.isEditing = true;
      component.techRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord[0];
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.PSV).techRecord[0];

      const axleEvent = {
        axles: [
          {
            axleNumber: 1
          },
          {
            axleNumber: 3
          }
        ]
      };

      component.removeAxle(axleEvent);

      expect(component.techRecordCalculated.axles!.length).toBe(2);
    });
  });

  describe('generateAxleSpacing', () => {
    it('should generate 3 axle spacings', () => {
      const res = component.generateAxleSpacing(4);

      expect(res).toStrictEqual([
        { axles: '1-2', value: null },
        { axles: '2-3', value: null },
        { axles: '3-4', value: null }
      ]);
    });

    it('should generate no axle spacings', () => {
      const res = component.generateAxleSpacing(1);

      expect(res).toStrictEqual([]);
    });

    it('should generate 3 axle spacings when adding a axle', () => {
      const originalAxleSpacing = [
        { axles: '1-2', value: 100 },
        { axles: '2-3', value: 200 }
      ];

      const res = component.generateAxleSpacing(4, true, originalAxleSpacing);

      expect(res).toStrictEqual([
        { axles: '1-2', value: 100 },
        { axles: '2-3', value: 200 },
        { axles: '3-4', value: null }
      ]);
    });
  });

  describe('normaliseVehicleTechRecordAxles', () => {
    it('should not change anything if the tech record is correct', () => {
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];
      component.normaliseVehicleTechRecordAxles();

      const axleSpacingMock = jest.spyOn(component, 'generateAxleSpacing');
      const axleMock = jest.spyOn(component, 'generateAxlesFromAxleSpacings');

      expect(axleSpacingMock).toHaveBeenCalledTimes(0);
      expect(axleMock).toHaveBeenCalledTimes(0);
    });

    it('should call generate spacings if there are more axles', () => {
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];
      component.techRecordCalculated.axles!.push({ axleNumber: 3 });

      expect(component.techRecordCalculated.dimensions?.axleSpacing?.length).toBe(1);

      component.normaliseVehicleTechRecordAxles();

      expect(component.techRecordCalculated.dimensions?.axleSpacing?.length).toBe(2);
    });

    it('should call generate axles if there are more spacings', () => {
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];
      component.techRecordCalculated.dimensions?.axleSpacing?.push({ axles: '2-3', value: 1 });

      expect(component.techRecordCalculated.axles!.length).toBe(2);

      component.normaliseVehicleTechRecordAxles();

      expect(component.techRecordCalculated.axles!.length).toBe(3);
    });

    it('should call generate spacings if there are none but there is axles', () => {
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];
      component.techRecordCalculated.dimensions!.axleSpacing = undefined;
      expect(component.techRecordCalculated.dimensions?.axleSpacing).toBe(undefined);

      component.normaliseVehicleTechRecordAxles();

      expect(component.techRecordCalculated.dimensions?.axleSpacing!.length).toBe(1);
    });

    it('should call generate spacings if there are none but there is axles and there is an object to start with', () => {
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];
      component.techRecordCalculated.dimensions!.axleSpacing = [];
      expect(component.techRecordCalculated.axles!.length).toBe(2);

      component.normaliseVehicleTechRecordAxles();

      expect(component.techRecordCalculated.dimensions?.axleSpacing!.length).toBe(1);
    });

    it('should call generate axles if there are none but there is spacings', () => {
      component.techRecordCalculated = mockVehicleTechnicalRecord(VehicleTypes.HGV).techRecord[0];
      component.techRecordCalculated.axles = [];
      expect(component.techRecordCalculated.dimensions?.axleSpacing!.length).toBe(1);

      component.normaliseVehicleTechRecordAxles();

      expect(component.techRecordCalculated.axles.length).toBe(2);
    });
  });

  describe('generateAxles', () => {
    it('should generate 3 axles from no previous data', () => {
      const res = component.generateAxlesFromAxleSpacings(VehicleTypes.HGV, 2);

      expect(res.length).toBe(3);
      expect(res[0].axleNumber).toBe(1);
      expect(res[2].axleNumber).toBe(3);
    });

    it('should generate 3 axles from 1 previous axle', () => {
      const previousAxles = [{ axleNumber: 1 }];
      const res = component.generateAxlesFromAxleSpacings(VehicleTypes.HGV, 2, previousAxles);

      expect(res.length).toBe(3);
      expect(res[0].axleNumber).toBe(1);
      expect(res[2].axleNumber).toBe(3);
    });
  });
});
