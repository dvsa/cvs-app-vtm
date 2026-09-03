import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { EnterBatchDetailsComponent } from '../enter-batch-details.component';

describe('EnterBatchDetailsComponent', () => {
	let router: Router;
	let fixture: ComponentFixture<EnterBatchDetailsComponent>;
	let component: EnterBatchDetailsComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EnterBatchDetailsComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideRouter([
					{
						path: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_BATCH_DETAILS}`,
						component: jest.fn(),
					},
					{
						path: `${RootRoutes.BATCH}/${BatchRoutes.CANCEL_BATCH}`,
						component: jest.fn(),
					},
				]),
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(EnterBatchDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('handleContinue', () => {
		it('should navigate the user to the batch size page if the form is valid', () => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.form.patchValue({
				vehicleType: VehicleTypes.PSV,
				vehicleStatus: StatusCodes.CURRENT,
			});
			component.handleContinue();
			expect(navigateSpy).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.ENTER_BATCH_SIZE]);
		});

		it('should not navigate the user to the batch size page if the form is invalid', () => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.form.patchValue({
				vehicleType: null,
				vehicleStatus: null,
			});
			component.handleContinue();
			expect(navigateSpy).not.toHaveBeenCalled();
		});
	});

	describe('handleCancel', () => {
		it('should navigate the user to the cancel batch page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.handleCancel();
			expect(navigateSpy).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.CANCEL_BATCH]);
		});
	});

	describe('handleFormChange', () => {
		it('should auto-select TES1 and disable other options when the vehicle type is TRL and the vehicle status is current', () => {
			component.ngOnInit();
			component.form.patchValue({
				vehicleType: VehicleTypes.TRL,
				vehicleStatus: StatusCodes.CURRENT,
			});
			expect(component.form.controls.trlFormType.value).toBe(TrailerFormType.TES1);
			expect(component.form.controls.trlFormType.disabled).toBe(true);
		});

		it('should clear entered trl form values and re-able the form when the vehicle type is not TRL', () => {
			component.ngOnInit();

			// Initial form
			component.form.patchValue({
				vehicleType: VehicleTypes.TRL,
				vehicleStatus: StatusCodes.CURRENT,
				trlFormType: TrailerFormType.TES1,
			});

			// Change vehicle type to PSV
			component.form.controls.vehicleType.patchValue(VehicleTypes.PSV);

			expect(component.form.controls.trlFormType.value).toBe(null);
			expect(component.form.controls.trlFormType.disabled).toBe(false);
		});
	});
});
