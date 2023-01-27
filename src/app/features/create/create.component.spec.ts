import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CreateComponent } from './create.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';

describe('CreateNewVehicleRecordComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let errorService: GlobalErrorService;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;
  let techRecordService: TechnicalRecordService;
  let expectedVehicle = { vrms: [{ vrm: '123', isPrimary: true }] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateComponent],
      providers: [
        GlobalErrorService,
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } }
      ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
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

  describe('get primaryVrm', () => {
    it('should get the primary VRM', () => {
      component.vehicle = expectedVehicle;
      expect(component.primaryVrm).toBe(expectedVehicle.vrms.find(vrm => vrm.isPrimary)?.vrm);
    });
  });

  describe('get isFormValid', () => {
    it('should call updateValidity with the vehicleForm and an empty array', () => {
      const updateValiditySpy = jest.spyOn(DynamicFormService, 'updateValidity').mockImplementation();
      component.isFormValid;
      expect(updateValiditySpy).toHaveBeenCalledTimes(1);
      expect(updateValiditySpy).toHaveBeenCalledWith(component.vehicleForm, []);
    });

    it('should call setErrors with an empty array', () => {
      jest.spyOn(DynamicFormService, 'updateValidity').mockImplementation(() => {
        return;
      });
      const setErrorsSpy = jest.spyOn(errorService, 'setErrors').mockImplementation();
      component.isFormValid;
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

    it('should navigate to hydrate when successful', fakeAsync(() => {
      jest.spyOn(component, 'isFormValid', 'get').mockReturnValue(true);
      jest.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(true));
      const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      const updateEditingSpy = jest.spyOn(techRecordService, 'updateEditingTechRecord');

      component.vehicle = { techRecord: [{ vehicleType: VehicleTypes.HGV } as TechRecordModel] };
      component.handleSubmit();
      tick();

      expect(routerSpy).toHaveBeenCalledWith(['../create/new-record-details'], { relativeTo: route });
    }));
  });

  describe('isVinUnique', () => {
    it('should call isUnique with an emptry string and the type of vin', async () => {
      const isUniqueSpy = jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

      const result = await component.isVinUnique();

      expect(isUniqueSpy).toBeCalledWith('', SEARCH_TYPES.VIN);
    });

    it('should return true when the VIN is unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

      const result = await component.isVinUnique();

      expect(result).toBeTruthy();
    });

    it('should call addError when the VIN is not unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
      const addErrorSpy = jest.spyOn(errorService, 'addError').mockImplementation();

      const result = await component.isVinUnique();

      expect(addErrorSpy).toBeCalledWith({ error: 'Vin not unique', anchorLink: 'input-vin' });
      expect(result).toBeFalsy();
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

      const result = await component.isTrailerIdUnique();

      expect(result).toBeTruthy();
    });

    it('should call addError when the trailer ID is not unique', async () => {
      jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
      const addErrorSpy = jest.spyOn(errorService, 'addError').mockImplementation();

      const result = await component.isTrailerIdUnique();

      expect(addErrorSpy).toBeCalledWith({ error: 'TrailerId not unique', anchorLink: 'input-vrm-or-trailer-id' });
      expect(result).toBeFalsy();
    });
  });
});
