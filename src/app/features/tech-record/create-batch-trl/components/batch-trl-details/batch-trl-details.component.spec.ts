import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';
import { of } from 'rxjs';
import { BatchTrlDetailsComponent } from './batch-trl-details.component';

const mockGlobalErrorService = {
  addError: jest.fn(),
  clearErrors: jest.fn(),
  setErrors: jest.fn()
};
describe('BatchTrlDetailsComponent', () => {
  let component: BatchTrlDetailsComponent;
  let fixture: ComponentFixture<BatchTrlDetailsComponent>;
  let router: Router;
  let store: MockStore<State>;
  let errorService: GlobalErrorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchTrlDetailsComponent],
      imports: [DynamicFormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [FormBuilder, { provide: GlobalErrorService, useValue: mockGlobalErrorService }, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BatchTrlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    errorService = TestBed.inject(GlobalErrorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isFormValid', () => {
    it('should throw an error if there are no vehicles', async () => {
      jest.spyOn(component, 'formStatus', 'get').mockImplementationOnce(() => of('VALID'));
      component.vehicles.push(component.vehicleForm);
      component.vehicleForm.get('vin')?.clearAsyncValidators();

      const isValid = component.isFormValid();
      await isValid;
      component.vehicleForm.updateValueAndValidity();
      expect(mockGlobalErrorService.addError).toBeCalledWith({ error: 'At least 1 vehicle must be created or updated in a batch' });
      expect(isValid).toBeFalsy();
    });
  });
});
