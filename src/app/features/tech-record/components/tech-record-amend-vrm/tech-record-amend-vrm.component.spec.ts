import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AbstractControl, AsyncValidatorFn, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { NotTrailer, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/index';
import { selectRouteData } from '@store/router/selectors/router.selectors';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { AmendVrmComponent } from './tech-record-amend-vrm.component';
import { TechRecordGETCar, TechRecordGETPSV, TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';

const mockTechRecordService = {
  techRecord$: of({}),
  get viewableTechRecord$() {
    return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', primaryVrm: 'TESTVRM' });
  },
  updateEditingTechRecord: jest.fn(),
  validateVrmDoesNotExist: jest.fn(),
  validateVrmForCherishedTransfer: jest.fn().mockReturnValue(of(null))
};

const mockDynamicFormService = {
  createForm: jest.fn(),
  validate: jest.fn()
};

describe('TechRecordChangeVrmComponent', () => {
  let actions$ = new ReplaySubject<Action>();
  let component: AmendVrmComponent;
  let errorService: GlobalErrorService;
  let fixture: ComponentFixture<AmendVrmComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore<State>;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendVrmComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1, reason: 'correcting-error' }]), snapshot: new ActivatedRouteSnapshot() } },
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

      expect(navigateSpy).toBeCalledWith(['../../'], { relativeTo: route });
    });

    it('should navigate to a new record on amendVrmSuccess', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      store.overrideSelector(selectRouteData, { data: { isEditing: true } });
      component.ngOnInit();

      actions$.next(amendVrmSuccess({ vehicleTechRecord: mockVehicleTechnicalRecord('psv') as TechRecordGETPSV }));

      expect(navigateSpy).toHaveBeenCalled();
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      component.techRecord = mockVehicleTechnicalRecord('psv') as TechRecordGETPSV;
      jest.resetAllMocks();
    });

    it('should add an error when the vrm field is not filled out', () => {
      const addErrorSpy = jest.spyOn(errorService, 'setErrors');

      component.handleSubmit();

      expect(addErrorSpy).toHaveBeenCalledWith([{ anchorLink: 'new-Vrm', error: 'New VRM is required' }]);
    });

    // it.only('should add an error when the field is equal to the current VRM', () => {
    //   mockTechRecordService.validateVrmDoesNotExist.mockReturnValue(of({ validateVrm: { message: 'hiya' } }));
    //   component.correctingAnErrorForm.get('newVrm')?.setValue('1234');
    //   const addErrorSpy = jest.spyOn(errorService, 'setErrors');
    //   component.correctingAnErrorForm.get('newVrm')?.setValue('KP01ABC');

    //   component.handleSubmit();

    //   expect(addErrorSpy).toHaveBeenCalledWith({ error: 'You must provide a new VRM', anchorLink: 'newVrm' });
    // });

    // it('should add an error if isUnique returns false', () => {
    //   const addErrorSpy = jest.spyOn(errorService, 'setErrors');
    //   mockTechRecordService.validateVrmDoesNotExist(of({validateVrm: {message: 'hi'}}))
    //   component.correctingAnErrorForm.get('newVrm')?.setAsyncValidators(mockTechRecordService.validateVrmDoesNotExist);
    //   component.correctingAnErrorForm.get('newVrm')?.setValue('KP01ABC')
    //   mockTechRecordService.validateVrmDoesNotExist.mockResolvedValue(of({validateVrm: {message: 'hi'}}))

    //   // component.cherishedTransferForm.get('currentVrm')?.setValue('test123');
    //   // component.cherishedTransferForm.get('thirdMark')?.setValue('test123');

    //   component.handleSubmit();

    //   expect(addErrorSpy).toHaveBeenCalledWith({ error: 'VRM already exists', anchorLink: 'newVrm' });
    // });

    //   it('should dispatch the amendVrm action', fakeAsync(() => {
    //     jest.spyOn(router, 'navigate').mockImplementation();
    //     jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(true));
    //     const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(() => Promise.resolve(true));

    //     component.cherishedTransferForm.get('currentVrm')?.setValue('TESTVRM1');

    //     component.handleSubmit();
    //     tick();

    //     expect(dispatchSpy).toHaveBeenCalledWith(
    //       amendVrm({ newVrm: 'TESTVRM1', cherishedTransfer: true, systemNumber: 'PSV', createdTimestamp: 'now' })
    //     );
    //   }));

    //   it('should be able to call it multiple times', fakeAsync(() => {
    //     jest.spyOn(router, 'navigate').mockImplementation();
    //     const submitSpy = jest.spyOn(component, 'handleSubmit').mockImplementation(() => Promise.resolve(true));

    //     // jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
    //     // component.handleSubmit();
    //     // tick();

    //     // jest.spyOn(mockTechRecordService, 'isUnique').mockReturnValueOnce(of(true));
    //     // component.handleSubmit();
    //     // tick();

    //     expect(submitSpy).toHaveBeenCalledTimes(2);
    //   }));
  });
});
