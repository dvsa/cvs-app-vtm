import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of, ReplaySubject } from 'rxjs';
import { AmendVinComponent } from './tech-record-amend-vin.component';
import { updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';

const mockTechRecordService = {
  editableTechRecord$: of({}),
  selectedVehicleTechRecord$: of({}),
  viewableTechRecord$: jest.fn(),
  updateEditingTechRecord: jest.fn(),
  isUnique: jest.fn(),
  getVehicleTypeWithSmallTrl: jest.fn(),
  validateVinForUpdate: jest.fn().mockReturnValue(of(null))
};

const mockDynamicFormService = {
  createForm: jest.fn()
};

describe('TechRecordChangeVrmComponent', () => {
  let actions$ = new ReplaySubject<Action>();
  let component: AmendVinComponent;
  let errorService: GlobalErrorService;
  let expectedTechRecord = {} as V3TechRecordModel;
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
    component.form.controls['vin'].setAsyncValidators(mockTechRecordService.validateVinForUpdate.bind(this));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('makeAndModel', () => {
  //   beforeEach(() => {
  //     expectedTechRecord = {systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin'};
  //     component.techRecord = expectedTechRecord;
  //   });
  //   // TODO: V3 PSV HGV TRL
  //   // it('should should return the make and model', () => {
  //   //   expect(component.makeAndModel).toBe(`${expectedTechRecord.chassisMake} - ${expectedTechRecord.chassisModel}`);
  //   // });

  //   // it('should return an empty string when the current record is null', () => {
  //   //   delete component.techRecord;

  //   //   expect(component.makeAndModel).toBe('');
  //   // });
  // });

  describe('handleSubmit', () => {
    beforeEach(() => {
      expectedTechRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      component.techRecord = expectedTechRecord;
    });
    it('should dispatch the updateTechRecord action with the new vin', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const payload = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'myNewVin', techRecord_reasonForCreation: 'Vin changed' };

      component.form.controls['vin'].setValue('myNewVin');

      component.handleSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(updateTechRecord({ vehicleTechRecord: payload }));
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

    it('should navigate away updateTechRecordSuccess', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      jest.spyOn(router, 'navigate').mockImplementation();

      actions$.next(updateTechRecordSuccess({ vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } }));
      tick();

      expect(navigateSpy).toHaveBeenCalled();
    }));
  });
});
