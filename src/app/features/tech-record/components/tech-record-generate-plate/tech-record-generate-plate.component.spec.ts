import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture, fakeAsync, TestBed, tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { generatePlate, generatePlateSuccess } from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { GeneratePlateComponent } from './tech-record-generate-plate.component';

const mockDynamicFormService = {
  createForm: jest.fn(),
};

describe('TechRecordGeneratePlateComponent', () => {
  const actions$ = new ReplaySubject<Action>();
  let component: GeneratePlateComponent;
  let errorService: GlobalErrorService;
  let fixture: ComponentFixture<GeneratePlateComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneratePlateComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
        { provide: DynamicFormService, useValue: mockDynamicFormService },
        TechnicalRecordService,
        {
          provide: UserService,
          useValue: {
            roles$: of(['TechRecord.Amend']),
          },
        },
      ],
      imports: [RouterTestingModule, SharedModule, ReactiveFormsModule, DynamicFormsModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePlateComponent);
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
    beforeEach(() => {
      jest
        .spyOn(technicalRecordService, 'techRecord$', 'get')
        .mockReturnValue(of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel));
    });
    it('should clear all errors', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

      component.navigateBack();

      expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
    });

    it('should navigate back to the previous page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      component.navigateBack();

      expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
    });

    it('should navigate back on generatePlateSuccess', fakeAsync(() => {
      component.ngOnInit();
      component.form.get('reason')?.setValue('Provisional');

      const navigateBackSpy = jest.spyOn(component, 'navigateBack').mockImplementation();

      component.handleSubmit();

      actions$.next(generatePlateSuccess());
      tick();

      expect(navigateBackSpy).toHaveBeenCalled();
    }));
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      jest
        .spyOn(technicalRecordService, 'techRecord$', 'get')
        .mockReturnValue(of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel));
    });
    it('should add an error when the field is not filled out', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit();

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'Reason for generating plate is required', anchorLink: 'reason' });
    });

    it('should dispatch the generatePlate action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.form.get('reason')?.setValue('Provisional');

      component.handleSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(generatePlate({ reason: 'Provisional' }));
    });
  });
});
