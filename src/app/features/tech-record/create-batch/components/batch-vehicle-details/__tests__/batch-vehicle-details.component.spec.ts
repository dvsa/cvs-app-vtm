import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

import { provideMockStore } from '@ngrx/store/testing';

import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { BatchVehicleDetailsComponent } from '../batch-vehicle-details.component';

const mockGlobalErrorService = {
	addError: jest.fn(),
	clearErrors: jest.fn(),
	setErrors: jest.fn(),
};
describe('BatchVehicleDetailsComponent', () => {
	let component: BatchVehicleDetailsComponent;
	let fixture: ComponentFixture<BatchVehicleDetailsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, BatchVehicleDetailsComponent],
			providers: [
				FormBuilder,
				{ provide: GlobalErrorService, useValue: mockGlobalErrorService },
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BatchVehicleDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('isFormValid', () => {
		it('should throw an error if there are no vehicles', async () => {
			jest.spyOn(component, 'formStatus', 'get').mockImplementationOnce(() => of('VALID'));
			component.vehicles.push(component.vehicleForm(0));
			component.vehicleForm(0).get('vin')?.clearAsyncValidators();

			await component.isFormValid();
			component.vehicleForm(0).updateValueAndValidity();
			expect(mockGlobalErrorService.addError).toHaveBeenCalledWith({
				error: 'At least 1 vehicle must be created or updated in a batch',
			});
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
