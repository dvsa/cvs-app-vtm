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
import { updateVin, updateVinSuccess } from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { AmendVinComponent } from './tech-record-amend-vin.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn(),
  updateEditingTechRecord: jest.fn(),
  isUnique: jest.fn(),
  getVehicleTypeWithSmallTrl: jest.fn(),
  validateVin: jest.fn().mockReturnValue(of(null))
};

const mockDynamicFormService = {
  createForm: jest.fn()
};

describe('TechRecordChangeVrmComponent', () => {
  let actions$ = new ReplaySubject<Action>();
  let component: AmendVinComponent;
  let errorService: GlobalErrorService;
  let expectedVehicle = {} as VehicleTechRecordModel;
  let fixture: ComponentFixture<AmendVinComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendVinComponent],
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
    fixture = TestBed.createComponent(AmendVinComponent);
    errorService = TestBed.inject(GlobalErrorService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    component = fixture.componentInstance;
    component.form.controls['vin'].clearAsyncValidators();
    component.form.controls['vin'].setAsyncValidators(mockTechRecordService.validateVin.bind(this));
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

  describe('handleSubmit', () => {
    it('should dispatch the updateVin function with the new vin', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.form.controls['vin'].setValue('myNewVin');
      component.vehicle!.systemNumber = '01234';

      const payload = {
        newVin: 'myNewVin',
        systemNumber: '01234'
      };

      component.handleSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(updateVin(payload));
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

    it('should navigate back on updateVinSuccess', fakeAsync(() => {
      const navigateBackSpy = jest.spyOn(component, 'navigateBack');
      jest.spyOn(router, 'navigate').mockImplementation();

      actions$.next(updateVinSuccess());
      tick();

      expect(navigateBackSpy).toHaveBeenCalled();
    }));
  });
});
