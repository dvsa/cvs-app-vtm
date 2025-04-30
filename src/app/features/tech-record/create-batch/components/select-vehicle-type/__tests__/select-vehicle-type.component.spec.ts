import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';

import { initialAppState } from '@store/index';
import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { SelectVehicleTypeComponent } from '../select-vehicle-type.component';

describe('SelectVehicleTypeComponent', () => {
	let component: SelectVehicleTypeComponent;
	let fixture: ComponentFixture<SelectVehicleTypeComponent>;
	let errorService: GlobalErrorService;
	let route: ActivatedRoute;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SelectVehicleTypeComponent, ReactiveFormsModule],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ vehicleType: 'trl' }]) } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SelectVehicleTypeComponent);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
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

	describe('cancel', () => {
		it('should clear all errors', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

			component.cancel();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.cancel();

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});
	});

	describe('handleSubmit', () => {
		it('should do nothing if the form is not valid', () => {
			jest.spyOn(component, 'isFormValid', 'get').mockReturnValue(false);
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.handleSubmit(VehicleTypes.TRL);
			expect(navigateSpy).toHaveBeenCalledTimes(0);
		});

		it('should navigate to batch records when successful', () => {
			jest.spyOn(component, 'isFormValid', 'get').mockReturnValue(true);
			const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
			component.handleSubmit(VehicleTypes.HGV);

			fixture.detectChanges();
			expect(routerSpy).toHaveBeenCalledWith(['hgv'], { relativeTo: route });
		});
	});
});
