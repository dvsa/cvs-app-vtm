import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SEARCH_TYPES } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { CreateTechRecordComponent } from './create-tech-record.component';

describe('CreateNewVehicleRecordComponent', () => {
  let component: CreateTechRecordComponent;
  let fixture: ComponentFixture<CreateTechRecordComponent>;
  let errorService: GlobalErrorService;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;
  let techRecordService: TechnicalRecordService;
  let expectedVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTechRecordComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, SharedModule],
      providers: [
        GlobalErrorService,
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTechRecordComponent);
    errorService = TestBed.inject(GlobalErrorService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    techRecordService = TestBed.inject(TechnicalRecordService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('get vehicleTypeOptions', () => {
    it('should return the expected options', () => {
      expect(component.vehicleTypeOptions).toBeTruthy();
    });
  });

  describe('get vehicleStatusOptions', () => {
    it('should return the expected options', () => {
      expect(component.vehicleStatusOptions).toBeTruthy();
    });
  });

  describe('get isFormValid', () => {
    it('should call validate with the vehicleForm and an empty array', () => {
      const validateSpy = jest.spyOn(DynamicFormService, 'validate').mockImplementation();
      const valid = component.isFormValid;
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(validateSpy).toHaveBeenCalledWith(component.form, []);
    });

    it('should call setErrors with an empty array', () => {
      jest.spyOn(DynamicFormService, 'validate').mockImplementation(() => {
        return;
      });
      const setErrorsSpy = jest.spyOn(errorService, 'setErrors').mockImplementation();
      const valid = component.isFormValid;
      expect(setErrorsSpy).toHaveBeenCalledTimes(1);
      expect(setErrorsSpy).toHaveBeenCalledWith([]);
    });

    it('should return vehicleForm.valid', () => {
      const formValid = component.isFormValid;
      expect(formValid).toBeFalsy();
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
    it('should do nothing if the form is not valid', () => {
      const formUniqueSpy = jest.spyOn(component, 'isFormValueUnique').mockImplementation();
      component.handleSubmit();
      expect(formUniqueSpy).toHaveBeenCalledTimes(0);
    });

    it('should do nothing if the form value not unique', () => {
      const isFormValid = jest.spyOn(component, 'isFormValid', 'get').mockReturnValue(true);
      const updateEditingSpy = jest.spyOn(techRecordService, 'updateEditingTechRecord');
      const navigateSpy = jest.spyOn(router, 'navigate');
      const generateTechREcordSpy = jest.spyOn(techRecordService, 'generateEditingVehicleTechnicalRecordFromVehicleType');
      component.handleSubmit();

      expect(isFormValid).toReturn();
      expect(updateEditingSpy).toHaveBeenCalledTimes(0);
      expect(generateTechREcordSpy).toHaveBeenCalledTimes(0);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });

    it('should navigate to hydrate when successful', async () => {
      jest.spyOn(component, 'isFormValid', 'get').mockReturnValue(true);
      jest.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(true));
      const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(techRecordService, 'updateEditingTechRecord');

      await component.handleSubmit();

      fixture.detectChanges();
      expect(routerSpy).toHaveBeenCalledWith(['../create/new-record-details'], { relativeTo: route });
    });
  });

  describe('isVinUnique', () => {
    it('should call isUnique with an emptry string and the type of vin', async () => {
      const isUniqueSpy = jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

      await component.isVinUnique();

      expect(isUniqueSpy).toBeCalledWith('', SEARCH_TYPES.VIN);
    });

    it('should return true when the VIN is unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

      const result = await component.isVinUnique();

      expect(result).toBeTruthy();
    });
  });

  describe('isVrmUnique', () => {
    it('should return true when the VRM is unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

      const result = await component.isVrmUnique();

      expect(result).toBeTruthy();
    });

    it('should call addError when the VRM is not unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
      const addErrorSpy = jest.spyOn(errorService, 'addError').mockImplementation();

      const result = await component.isVrmUnique();

      expect(addErrorSpy).toBeCalledWith({ error: 'Vrm not unique', anchorLink: 'input-vrm-or-trailer-id' });
      expect(result).toBeFalsy();
    });
  });

  describe('isTrailerIdUnique', () => {
    it('should return true when the trailer ID is unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));
      component.techRecord = { techRecord_vehicleType: 'trl' };

      const result = await component.isTrailerIdUnique();

      expect(result).toBeTruthy();
    });

    it('should call addError when the trailer ID is not unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
      const addErrorSpy = jest.spyOn(errorService, 'addError').mockImplementation();
      component.techRecord = { techRecord_vehicleType: 'trl' };

      const result = await component.isTrailerIdUnique();

      expect(addErrorSpy).toBeCalledWith({ error: 'TrailerId not unique', anchorLink: 'input-vrm-or-trailer-id' });
      expect(result).toBeFalsy();
    });
  });
});
