import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
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
import { AmendVrmReasonComponent } from './tech-record-amend-vrm-reason.component';
import { TechRecordGETCar, TechRecordGETPSV, TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';

const mockTechRecordService = {
  techRecord$: of({}),
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
  let component: AmendVrmReasonComponent;
  let errorService: GlobalErrorService;
  let expectedVehicle = {} as V3TechRecordModel;
  let fixture: ComponentFixture<AmendVrmReasonComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore<State>;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmendVrmReasonComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]), snapshot: new ActivatedRouteSnapshot() } },
        { provide: DynamicFormService, useValue: mockDynamicFormService },
        TechnicalRecordService
      ],
      imports: [RouterTestingModule, SharedModule, ReactiveFormsModule, DynamicFormsModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendVrmReasonComponent);
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
  describe('errors', () => {
    it('should add an error when the reason for amending is not selected', () => {
      const addErrorSpy = jest.spyOn(errorService, 'setErrors');

      component.submit();

      expect(addErrorSpy).toHaveBeenCalledWith([{ error: 'Reason for change is required', anchorLink: 'is-cherished-transfer' }]);
    });
  });
  describe('submit', () => {
    it('should navigate to correct-error', () => {
      const navigationSpy = jest.spyOn(router, 'navigate');
      component.form.controls['isCherishedTransfer'].setValue('correcting-error');
      component.submit();

      expect(navigationSpy).toHaveBeenCalledWith(['correcting-error'], { relativeTo: expect.anything() });
    });
    it('should navigate to cherished-transfer', () => {
      const navigationSpy = jest.spyOn(router, 'navigate');
      component.form.controls['isCherishedTransfer'].setValue('cherished-transfer');
      component.submit();

      expect(navigationSpy).toHaveBeenCalledWith(['cherished-transfer'], { relativeTo: expect.anything() });
    });
  });
});
