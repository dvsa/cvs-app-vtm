import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { approvalType, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { generateLetter, generateLetterSuccess } from '@store/technical-records';
import { of, ReplaySubject } from 'rxjs';
import { GenerateLetterComponent } from './tech-record-generate-letter.component';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { ReactiveFormsModule } from '@angular/forms';

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

describe('TechRecordGenerateLetterComponent', () => {
  let actions$ = new ReplaySubject<Action>();
  let component: GenerateLetterComponent;
  let errorService: GlobalErrorService;
  let expectedVehicle = {} as VehicleTechRecordModel;
  let fixture: ComponentFixture<GenerateLetterComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;
  let technicalRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateLetterComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
        { provide: DynamicFormService, useValue: mockDynamicFormService },
        { provide: TechnicalRecordService, useValue: mockTechRecordService }
      ],
      imports: [RouterTestingModule, SharedModule, ReactiveFormsModule, DynamicFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLetterComponent);
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

      expect(navigateSpy).toBeCalledWith(['..'], { relativeTo: route });
    });

    it('should navigate back on generateLetterSuccess', fakeAsync(() => {
      component.form.get('letterType')?.setValue('trailer authorsation');
      component.handleSubmit();

      const navigateBackSpy = jest.spyOn(component, 'navigateBack');
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      actions$.next(generateLetterSuccess());
      tick();

      expect(navigateBackSpy).toHaveBeenCalled();
    }));
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      expectedVehicle = mockVehicleTechnicalRecord(VehicleTypes.TRL);
    });

    it('should add an error when the field is not filled out', () => {
      const addErrorSpy = jest.spyOn(errorService, 'addError');

      component.handleSubmit();

      expect(addErrorSpy).toHaveBeenCalledWith({ error: 'Letter type is required', anchorLink: 'letterType' });
    });

    describe('it should dispatch the generateLetter action with the correct paragraphIds', () => {
      it('should dispatch with id 3 on acceptance', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.currentTechRecord = expectedVehicle.techRecord[0];
        component.currentTechRecord.approvalType = approvalType.SMALL_SERIES;

        component.form.get('letterType')?.setValue('trailer acceptance');
        component.handleSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(generateLetter({ letterType: 'trailer acceptance', paragraphId: 3 }));
      });

      it('should dispatch with id 4 on rejection', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.currentTechRecord = expectedVehicle.techRecord[0];
        component.currentTechRecord.approvalType = approvalType.GB_WVTA;

        component.form.get('letterType')?.setValue('trailer rejection');
        component.handleSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(generateLetter({ letterType: 'trailer rejection', paragraphId: 4 }));
      });

      it('should dispatch with id 6 on acceptance', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.currentTechRecord = expectedVehicle.techRecord[0];
        component.currentTechRecord.approvalType = approvalType.GB_WVTA;

        component.form.get('letterType')?.setValue('trailer acceptance');
        component.handleSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(generateLetter({ letterType: 'trailer acceptance', paragraphId: 6 }));
      });
    });
  });
});
