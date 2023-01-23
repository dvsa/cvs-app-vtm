import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponent } from './create.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { RouterTestingModule } from '@angular/router/testing';

const mockTechRecordService = {
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateComponent],
      providers: [
        GlobalErrorService,
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
        { provide: TechnicalRecordService, useValue: mockTechRecordService }
      ],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    errorService = TestBed.inject(GlobalErrorService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
  });

  describe('handleSubmit', () => {
    describe('Unhappy', () => {
      it('should invoke the global error component for failed validation rules', () => {});
      it('should invoke the global error component for non unique values', () => {});
    });
    describe('Happy', () => {
      it('should dispatch updateEditingTechRecord', () => {});
      it('generateEditingVehicleTechnicalRecordFromVehicleType', () => {});
      it('should navigate to hydrate on success', () => {});
    });
  });
});
