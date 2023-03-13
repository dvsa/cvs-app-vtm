import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { updateTechRecordsSuccess } from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { AmendVrmComponent } from './tech-record-amend-vrm.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn(),
  updateEditingTechRecord: jest.fn(),
  isUnique: jest.fn()
};

const mockDynamicFormService = {
  createForm: jest.fn()
};

describe('TechRecordChangeVrmComponent', () => {
  let actions$ = new ReplaySubject<Action>();
  let component: AmendVrmComponent;
  let errorService: GlobalErrorService;
  let expectedVehicle = {} as VehicleTechRecordModel;
  let fixture: ComponentFixture<AmendVrmComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendVrmComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]), snapshot: new ActivatedRouteSnapshot() } },
        { provide: DynamicFormService, useValue: mockDynamicFormService },
        { provide: TechnicalRecordService, useValue: mockTechRecordService }
      ],
      imports: [RouterTestingModule, SharedModule, ReactiveFormsModule, DynamicFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendVrmComponent);
    errorService = TestBed.inject(GlobalErrorService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('makeAndModel', () => {
    beforeEach(() => {
      expectedVehicle = mockVehicleTechnicalRecord(VehicleTypes.PSV);
      component.vehicle = expectedVehicle;
    });

    it('should should return the make and model', () => {
      const expectedTechRecord = expectedVehicle.techRecord.pop()!;

      component.techRecord = expectedTechRecord;

      expect(component.makeAndModel).toBe(`${expectedTechRecord.chassisMake} - ${expectedTechRecord.chassisModel}`);
    });

    it('should return an empty string when the current record is null', () => {
      delete component.techRecord;

      expect(component.makeAndModel).toBe('');
    });
  });

  describe('vrm', () => {
    beforeEach(() => {
      expectedVehicle = mockVehicleTechnicalRecord(VehicleTypes.PSV);
      component.vehicle = expectedVehicle;
    });

    it('should return the primary VRM', () => {
      component.vehicle = expectedVehicle;

      expect(component.vrm).toBe('KP01ABC');
    });

    it('should return undefined when the vehicle is null', () => {
      delete component.vehicle;

      expect(component.vrm).toBe(undefined);
    });
  });

  describe('navigateBack', () => {
    it('should clear all errors', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

      component.navigateBack();

      expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
    });

    it('should navigate back to the previous page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      component.navigateBack();

      expect(navigateSpy).toBeCalledWith(['..'], { relativeTo: route });
    });

    it('should navigate back on updateTechRecordsSuccess', fakeAsync(() => {
      const navigateBackSpy = jest.spyOn(component, 'navigateBack');
      jest.spyOn(router, 'navigate').mockImplementation();

      actions$.next(updateTechRecordsSuccess({}));

      expect(navigateBackSpy).toHaveBeenCalled();
    }));
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      component.vehicle = { vrms: [{ vrm: 'KP01ABC', isPrimary: true }] } as VehicleTechRecordModel;
    });

    it('should add an error when the vrm field is not filled out', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit();

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    });

    it('should add an error when the reason for amending is not selected', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.form.get('newVrm')?.setValue('test123');
      component.form.get('isCherishedTransfer')?.setValue(undefined);

      component.handleSubmit();

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a reason for amending', anchorLink: 'cherishedTransfer' });
    });

    it('should add an error when the field is equal to the current VRM', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit();

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    });

    it('should add an error if isUnique returns false', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');
      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(false));

      component.form.get('newVrm')?.setValue('test123');
      component.form.get('isCherishedTransfer')?.setValue('false');

      component.handleSubmit();

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'VRM already exists', anchorLink: 'newVrm' });
    });

    it('should dispatch the updateEditingTechRecord action', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation();
      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
      const dispatchSpy = jest.spyOn(mockTechRecordService, 'updateEditingTechRecord').mockImplementation(() => Promise.resolve(true));

      component.vehicle = { vrms: [{ vrm: 'VRM1', isPrimary: true }] } as VehicleTechRecordModel;

      component.form.get('newVrm')?.setValue('testvrm');
      component.form.get('isCherishedTransfer')?.setValue('true');

      component.handleSubmit();
      tick();

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        vrms: [
          { vrm: 'VRM1', isPrimary: false },
          { vrm: 'TESTVRM', isPrimary: true }
        ]
      });
    }));

    it('should be able to call it multiple times', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation();
      const submitSpy = jest.spyOn(component, 'handleSubmit').mockImplementation(() => Promise.resolve(true));

      component.vehicle = { vrms: [{ vrm: 'VRM1', isPrimary: true }] } as VehicleTechRecordModel;

      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
      component.handleSubmit();
      tick();

      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
      component.handleSubmit();
      tick();

      expect(submitSpy).toHaveBeenCalledTimes(2);
    }));
  });

  describe('amendVrm', () => {
    it('should amend a VRM as cherished transfer, and retain original vrm', fakeAsync(() => {
      component.vehicle = {
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      } as VehicleTechRecordModel;

      const newVehicle = component.amendVrm(component.vehicle, 'VRM2', true);
      tick();

      expect(newVehicle).toEqual({
        vrms: [
          { vrm: 'VRM1', isPrimary: false },
          { vrm: 'VRM2', isPrimary: true }
        ]
      });
    }));

    it('should amend a VRM as correcting an error, and not retain the original vrm', fakeAsync(() => {
      component.vehicle = {
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      } as VehicleTechRecordModel;

      const newVehicle = component.amendVrm(component.vehicle, 'VRM2', false);
      tick();

      expect(newVehicle).toEqual({
        vrms: [{ vrm: 'VRM2', isPrimary: true }]
      });
    }));

    it('should make the old primary vrm no longer primary', () => {
      const oldPrimaryVrm = 'VRM1';
      component.vehicle = {
        techRecord: [{ reasonForCreation: '' }],
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      } as VehicleTechRecordModel;

      const newVehicle = component.amendVrm(component.vehicle, 'TESTVRM', true);

      expect(newVehicle.vrms.find(vrm => vrm.vrm == oldPrimaryVrm)?.isPrimary).toBeFalsy();
    });

    it('should handle amending duplicate VRMs', fakeAsync(() => {
      component.vehicle = {
        vrms: [
          { vrm: 'VRM1', isPrimary: true },
          { vrm: 'VRM2', isPrimary: false }
        ]
      } as VehicleTechRecordModel;

      const newVehicle = component.amendVrm(component.vehicle, 'VRM2', true);
      tick();

      expect(newVehicle).toEqual({
        vrms: [
          { vrm: 'VRM1', isPrimary: false },
          { vrm: 'VRM2', isPrimary: true }
        ]
      });
    }));
  });
});
