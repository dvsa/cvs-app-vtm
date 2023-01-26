import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
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
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
        { provide: DynamicFormService, useValue: mockDynamicFormService },
        { provide: TechnicalRecordService, useValue: mockTechRecordService }
      ],
      imports: [RouterTestingModule]
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
    expectedVehicle = mockVehicleTechnicalRecord(VehicleTypes.PSV);
    component.vehicle = expectedVehicle;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('makeAndModel', () => {
    it('should should return the make and model', () => {
      const expectedTechRecord = expectedVehicle.techRecord.pop()!;

      component.currentTechRecord = expectedTechRecord;

      expect(component.makeAndModel).toBe(`${expectedTechRecord.chassisMake} - ${expectedTechRecord.chassisModel}`);
    });

    it('should return an empty string when the current record is null', () => {
      delete component.currentTechRecord;

      expect(component.makeAndModel).toBe('');
    });
  });

  describe('vrm', () => {
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
  });

  describe('handleSubmit', () => {
    it('should add an error when the field is not filled out', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit('');

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    });

    it('should add an error when the field is equal to the current VRM', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit('KP01ABC');

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    });

    it('should add an error if isUnique returns false', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');
      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(false));

      component.handleSubmit('TESTVRM');

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'VRM already exists', anchorLink: 'newVrm' });
    });

    it('should dispatch the updateEditingTechRecord action', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation();
      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
      jest.spyOn(component, 'setReasonForCreation').mockImplementation();
      const dispatchSpy = jest.spyOn(mockTechRecordService, 'updateEditingTechRecord').mockImplementation(() => Promise.resolve(true));

      component.vehicle = { vrms: [{ vrm: 'VRM1', isPrimary: true }] } as VehicleTechRecordModel;

      component.handleSubmit('TESTVRM');
      tick();

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        vrms: [
          { vrm: 'VRM1', isPrimary: false },
          { vrm: 'TESTVRM', isPrimary: true }
        ]
      });
    }));

    it('navigate back to the tech record', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));

      component.handleSubmit('TESTVRM');

      expect(navigateSpy).toHaveBeenCalledWith([`..`], { relativeTo: route });
    });
  });

  describe('amendVrm', () => {
    it('should make the old primary vrm no longer primary', () => {
      const oldPrimaryVrm = 'VRM1';
      component.vehicle = {
        techRecord: [{ reasonForCreation: '' }],
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      } as VehicleTechRecordModel;

      const newVehicle = component.amendVrm(component.vehicle, 'TESTVRM');

      expect(!newVehicle.vrms.find(vrm => vrm.vrm == oldPrimaryVrm)?.isPrimary);
    });

    it('should handle amending duplicate VRMs', fakeAsync(() => {
      component.vehicle = {
        vrms: [
          { vrm: 'VRM1', isPrimary: true },
          { vrm: 'VRM2', isPrimary: false }
        ]
      } as VehicleTechRecordModel;

      const newVehicle = component.amendVrm(component.vehicle, 'VRM2');
      tick();

      expect(newVehicle).toEqual({
        vrms: [
          { vrm: 'VRM1', isPrimary: false },
          { vrm: 'VRM2', isPrimary: true }
        ]
      });
    }));
  });

  describe('setReasonForCreation', () => {
    it('should set the reason for creation', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      component.vehicle = {
        techRecord: [{ reasonForCreation: '' }],
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      } as VehicleTechRecordModel;

      component.setReasonForCreation(component.vehicle);

      expect(component.vehicle).toEqual({
        techRecord: [{ reasonForCreation: 'Amending VRM.' }],
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      });
    });

    it('should set the reason for creation on multiple tech records', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      component.vehicle = {
        techRecord: [{ reasonForCreation: '' }, { reasonForCreation: 'Created' }],
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      } as VehicleTechRecordModel;

      component.setReasonForCreation(component.vehicle);

      expect(component.vehicle).toEqual({
        techRecord: [{ reasonForCreation: 'Amending VRM.' }, { reasonForCreation: 'Amending VRM.' }],
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      });
    });

    it('should handle being given no tech records', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      component.vehicle = {
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      } as VehicleTechRecordModel;

      component.setReasonForCreation(component.vehicle);

      expect(component.vehicle).toEqual({
        vrms: [{ vrm: 'VRM1', isPrimary: true }]
      });
    });
  });
});
