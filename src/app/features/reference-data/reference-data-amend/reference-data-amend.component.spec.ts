import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReferenceDataService } from '@api/reference-data';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/.';
import { ReferenceDataAmendComponent } from './reference-data-amend.component';
import { of } from 'rxjs';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { QueryList } from '@angular/core';

const mockRefDataService = {
  loadReferenceData: jest.fn(),
  loadReferenceDataByKey: jest.fn(),
  fetchReferenceDataByKey: jest.fn()
};

describe('ReferenceDataAmendComponent', () => {
  let component: ReferenceDataAmendComponent;
  let fixture: ComponentFixture<ReferenceDataAmendComponent>;
  let store: MockStore<State>;
  let router: Router;
  let route: ActivatedRoute;
  let errorService: GlobalErrorService;
  let referenceDataService: ReferenceDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataAmendComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        ReferenceDataService,
        { provide: UserService, useValue: {} },
        { provide: ReferenceDataService, useValue: mockRefDataService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReferenceDataAmendComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    errorService = TestBed.inject(GlobalErrorService);
    route = TestBed.inject(ActivatedRoute);
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

  describe('handleFormChange', () => {
    it('should set amendedData', () => {
      component.handleFormChange({ foo: 'bar' });

      expect(component.amendedData).toEqual({ foo: 'bar' });
    });
  });

  describe('handleSubmit', () => {
    it('should dispatch if form is valid', () => {
      component.data = { description: 'test' };
      component.amendedData = { description: 'testing' };
      jest.spyOn(component, 'checkForms').mockImplementationOnce(() => {
        component.isFormInvalid = false;
      });
      const dispatch = jest.spyOn(store, 'dispatch');

      component.handleSubmit();

      expect(dispatch).toHaveBeenCalled();
    });

    it('should not dispatch if form is invalid', () => {
      jest.spyOn(component, 'checkForms').mockImplementationOnce(() => {
        component.isFormInvalid = true;
      });
      const dispatch = jest.spyOn(store, 'dispatch');

      component.handleSubmit();

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
