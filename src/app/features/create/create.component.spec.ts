import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateComponent } from './create.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockTechRecordService = {
  isUnique: of(true),
  updateEditingTechRecord$: of({}),
  generateEditingVehicleTechnicalRecordFromVehicleType: of({})
};

describe('CreateNewVehicleRecordComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let errorService: GlobalErrorService;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;
  let techRecordService: TechnicalRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateComponent],
      providers: [
        GlobalErrorService,
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } }
        // { provide: TechnicalRecordService, useValue: mockTechRecordService }
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
    it('should return the expected options', () => {});
  });

  describe('get primaryVrm', () => {
    it('should get the primary VRM', () => {});
  });

  describe('get isFormValid', () => {
    it('should call updateValidity with the vehicleForm and an empty array', () => {});

    it('should call setErrors with an empty array', () => {});

    it('should return vehicleForm.valid', () => {});
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
    it('should do nothing if the form is not valid', () => {});

    it('should do nothing if the form value not unique', () => {});

    it('should call updateEditingTechRecord with the vehicle', () => {});

    it('should call generateEditingVehicleTechnicalRecordFromVehicleType with the vehicle type', () => {});

    it('should navigate to the next page', () => {});
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
    it('should return true when the VRM is unique', () => {});

    it('should call addError when the VRM is not unique', () => {});
  });

  describe('isTrailerIdUnique', () => {
    it('should return true when the trailer ID is unique', () => {});

    it('should call addError when the trailer ID is not unique', () => {});
  });
});
