import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { changeVehicleType } from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { ChangeVehicleTypeComponent } from './tech-record-change-type.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn(),
  clearReasonForCreation: jest.fn()
};

const mockDynamicFormService = {
  createForm: jest.fn()
};

describe('TechRecordChangeTypeComponent', () => {
  let actions$ = new ReplaySubject<Action>();
  let component: ChangeVehicleTypeComponent;
  let errorService: GlobalErrorService;
  let expectedVehicle = {} as VehicleTechRecordModel;
  let fixture: ComponentFixture<ChangeVehicleTypeComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeVehicleTypeComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
        { provide: DynamicFormService, useValue: mockDynamicFormService },
        { provide: TechnicalRecordService, useValue: mockTechRecordService }
      ],
      imports: [DynamicFormsModule, RouterTestingModule, SharedModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehicleTypeComponent);
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

      component.techRecord = expectedTechRecord;

      expect(component.makeAndModel).toBe(`${expectedTechRecord.chassisMake} - ${expectedTechRecord.chassisModel}`);
    });

    it('should return an empty string when the current record is null', () => {
      delete component.techRecord;

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

  describe('vehicleTypeOptions', () => {
    it('should return all types except for the current one', () => {
      component.techRecord = expectedVehicle.techRecord.pop()!;

      const expectedOptions = getOptionsFromEnumAcronym(VehicleTypes).filter(type => type.value !== VehicleTypes.PSV);

      expect(component.vehicleTypeOptions).toStrictEqual(expectedOptions);
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
    it('should add an error when no vehicle type is selected', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit(null as unknown as VehicleTypes);

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' });
    });

    it('should dispatch the changeVehicleType action', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.handleSubmit(VehicleTypes.PSV);

      expect(dispatchSpy).toHaveBeenCalledWith(changeVehicleType({ vehicleType: VehicleTypes.PSV }));
    });

    it('should call clearReasonForCreation', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const clearReasonForCreationSpy = jest.spyOn(mockTechRecordService, 'clearReasonForCreation');

      jest.resetAllMocks();
      component.handleSubmit(VehicleTypes.PSV);

      expect(clearReasonForCreationSpy).toHaveBeenCalledTimes(1);
    });

    it('navigate to the editing page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      component.handleSubmit(VehicleTypes.PSV);

      expect(navigateSpy).toHaveBeenCalledWith([`../amend-reason`], { relativeTo: route });
    });
  });
});
