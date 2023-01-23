import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { changeVehicleType, updateEditingTechRecord } from '@store/technical-records';
import cloneDeep from 'lodash.clonedeep';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AmendVrmComponent } from './tech-record-amend-vrm.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn()
};

const mockDynamicFormService = {
  createForm: jest.fn()
};

describe('TechRecordChangeTypeComponent', () => {
  let actions$ = new ReplaySubject<Action>();
  let component: AmendVrmComponent;
  let errorService: GlobalErrorService;
  let expectedVehicle = {} as VehicleTechRecordModel;
  let fixture: ComponentFixture<AmendVrmComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;

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
    component = fixture.componentInstance;
    expectedVehicle = mockVehicleTechnicalRecord(VehicleTypes.PSV);
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

      expect(component.vrm).toBe(expectedVehicle.vrms.find(vrm => vrm.isPrimary)?.vrm);
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

      component.handleSubmit(expectedVehicle.vrms.find(vrm => vrm.isPrimary)!.vrm);

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVRM' });
    });

    it('should dispatch the updateEditingTechRecord action', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.handleSubmit('TESTVRM');

      expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord);
    });

    it('should make the old primary vrm no longer primary', () => {
      jest.spyOn(router, 'navigate').mockImplementation();
      const oldVrms = cloneDeep(expectedVehicle.vrms);

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.handleSubmit('TESTVRM');

      expect();
    });

    it('navigate to the editing page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      component.handleSubmit(VehicleTypes.PSV);

      expect(navigateSpy).toHaveBeenCalledWith([`../amend-reason`], { relativeTo: route });
    });
  });
});
