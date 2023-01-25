import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { updateEditingTechRecord } from '@store/technical-records';
import cloneDeep from 'lodash.clonedeep';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AmendVrmComponent } from './tech-record-amend-vrm.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn(),
  // getByVrm: (vrm: string) => of(<VehicleTechRecordModel[]>{})
  getByVrm: jest.fn(),
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

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVRM' });
    });

    it('should add an error when the field is equal to the current VRM', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit('KP01ABC');

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVRM' });
    });

    it('should add an error if isUnique returns false', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');
      jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(false));

      component.handleSubmit('TESTVRM');

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'VRM already exists', anchorLink: 'newVRM' });
    });

    it('should dispatch the updateEditingTechRecord action', () => {
      jest.spyOn(router, 'navigate').mockImplementation();
      jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(true));

      component.vehicle = { vin: 'TESTVIN', vrms: [{ vrm: 'VRM1', isPrimary: true }] } as VehicleTechRecordModel;

      const dispatchSpy = jest.spyOn(mockTechRecordService, 'updateEditingTechRecord');

      component.handleSubmit('TESTVRM');

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        vin: 'TESTVIN',
        vrms: [
          { vrm: 'VRM1', isPrimary: false },
          { vrm: 'TESTVRM', isPrimary: true }
        ]
      });
    });

    it('should make the old primary vrm no longer primary', () => {
      jest.spyOn(router, 'navigate').mockImplementation();
      jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(true));
      const oldPrimaryVrm = 'KP01ABC';

      expect(expectedVehicle.vrms.find(vrm => vrm.vrm == oldPrimaryVrm)?.isPrimary);

      component.handleSubmit('TESTVRM');

      expect(!expectedVehicle.vrms.find(vrm => vrm.vrm == oldPrimaryVrm)?.isPrimary);
    });

    it('navigate back to the tech record', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(true));

      component.handleSubmit('TESTVRM');

      expect(navigateSpy).toHaveBeenCalledWith([`../amend-reason`], { relativeTo: route });
    });
  });
});
