import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
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
			declarations: [BatchVehicleDetailsComponent],
			imports: [DynamicFormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
			providers: [
				FormBuilder,
				{ provide: GlobalErrorService, useValue: mockGlobalErrorService },
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
