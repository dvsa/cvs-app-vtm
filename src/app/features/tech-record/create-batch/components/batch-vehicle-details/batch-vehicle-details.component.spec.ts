import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';
import { of } from 'rxjs';
import { BatchVehicleDetailsComponent } from './batch-vehicle-details.component';

const mockGlobalErrorService = {
  addError: jest.fn(),
  clearErrors: jest.fn(),
  setErrors: jest.fn(),
};
describe('BatchVehicleDetailsComponent', () => {
  let component: BatchVehicleDetailsComponent;
  let fixture: ComponentFixture<BatchVehicleDetailsComponent>;
  let router: Router;
  let store: MockStore<State>;
  let errorService: GlobalErrorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchVehicleDetailsComponent],
      imports: [DynamicFormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [FormBuilder, { provide: GlobalErrorService, useValue: mockGlobalErrorService }, provideMockStore({ initialState: initialAppState })],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BatchVehicleDetailsComponent);
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

      await component.isFormValid();
      component.vehicleForm.updateValueAndValidity();
      expect(mockGlobalErrorService.addError).toHaveBeenCalledWith({ error: 'At least 1 vehicle must be created or updated in a batch' });
    });
  });

  describe('checkDuplicateVins', () => {
    it('should return duplicate vins and their indexes', () => {
      const arr = [{ vin: '123' }, { vin: '123' }, { vin: '123' }, { vin: '' }, { vin: '' }];
      expect(component.checkDuplicateVins(arr)).toStrictEqual([
        { vin: '123', anchor: 1 },
        { vin: '123', anchor: 2 },
      ]);
    });
  });
});
