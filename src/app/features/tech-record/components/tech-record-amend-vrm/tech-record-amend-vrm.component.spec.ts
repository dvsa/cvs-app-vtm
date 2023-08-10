import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { V3TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { amendVrm, amendVrmSuccess, updateTechRecordSuccess } from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { AmendVrmComponent } from './tech-record-amend-vrm.component';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  get viewableTechRecord$() {
    return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', primaryVrm: 'TESTVRM' });
  },
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
  let expectedVehicle = {} as V3TechRecordModel;
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
  // TODO V3 PSV
  // describe('makeAndModel', () => {
  //   beforeEach(() => {
  //     expectedVehicle = mockVehicleTechnicalRecord(VehicleTypes.PSV);
  //     component.vehicle = expectedVehicle;
  //   });

  //   it('should should return the make and model', () => {
  //     const expectedTechRecord = expectedVehicle.techRecord.pop()!;

  //     component.techRecord = expectedTechRecord;

  //     expect(component.makeAndModel).toBe(`${expectedTechRecord.chassisMake} - ${expectedTechRecord.chassisModel}`);
  //   });

  //   it('should return an empty string when the current record is null', () => {
  //     delete component.techRecord;

  //     expect(component.makeAndModel).toBe('');
  //   });
  // });

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

    it('should navigate to a new record on updateTechRecordsSuccess', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      actions$.next(amendVrmSuccess({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' }));

      expect(navigateSpy).toHaveBeenCalled();
    }));
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      component.techRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', primaryVrm: 'TESTVRM' };
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

    it('should dispatch the amendVrm action', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation();
      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
      const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(() => Promise.resolve(true));

      component.form.get('newVrm')?.setValue('TESTVRM1');
      component.form.get('isCherishedTransfer')?.setValue(true);

      component.handleSubmit();
      tick();

      expect(dispatchSpy).toHaveBeenCalledWith(
        amendVrm({ newVrm: 'TESTVRM1', cherishedTransfer: true, systemNumber: 'foo', createdTimestamp: 'bar' })
      );
    }));

    it('should be able to call it multiple times', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockImplementation();
      const submitSpy = jest.spyOn(component, 'handleSubmit').mockImplementation(() => Promise.resolve(true));

      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
      component.handleSubmit();
      tick();

      jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
      component.handleSubmit();
      tick();

      expect(submitSpy).toHaveBeenCalledTimes(2);
    }));
  });
});
