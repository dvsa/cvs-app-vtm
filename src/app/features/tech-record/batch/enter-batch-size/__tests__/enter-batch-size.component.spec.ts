import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { initialAppState } from '@/src/app/store';
import { selectBatchDetails, selectVehicleType } from '@/src/app/store/technical-records/batch-create.selectors';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EnterBatchSizeComponent } from '../enter-batch-size.component';

describe('EnterBatchSizeComponent', () => {
	let store: MockStore;
	let router: Router;
	let fixture: ComponentFixture<EnterBatchSizeComponent>;
	let component: EnterBatchSizeComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EnterBatchSizeComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideRouter([
					{
						path: `${RootRoutes.BATCH}/${BatchRoutes.CANCEL_BATCH}`,
						component: jest.fn(),
					},
					{
						path: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_BATCH_IDENTIFIERS}`,
						component: jest.fn(),
					},
				]),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(EnterBatchSizeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		store.resetSelectors();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('computePageTitle', () => {
		it('should return the correct title when HGV is selected', () => {
			store.overrideSelector(selectVehicleType, VehicleTypes.HGV);
			store.refreshState();
			expect(component.computePageTitle()).toBe('Enter number of HGVs in this batch');
		});

		it('should return the correct title when PSV is selected', () => {
			store.overrideSelector(selectVehicleType, VehicleTypes.PSV);
			store.refreshState();
			expect(component.computePageTitle()).toBe('Enter number of PSVs in this batch');
		});

		it('should return the correct title when trailer is selected', () => {
			store.overrideSelector(selectVehicleType, VehicleTypes.TRL);
			store.refreshState();
			expect(component.computePageTitle()).toBe('Enter number of trailers in this batch');
		});
	});

	describe('handlePopulateForm', () => {
		it('should populate the form with the saved batch details', () => {
			const savedBatchDetails = {
				vehicleType: VehicleTypes.PSV,
				vehicleStatus: StatusCodes.CURRENT,
				trlFormType: TrailerFormType.TES1,
				batchSize: 10,
			};
			store.overrideSelector(selectBatchDetails, savedBatchDetails);
			store.refreshState();
			component.handlePopulateForm();
			expect(component.form.getRawValue()).toEqual({ batchSize: 10 });
		});
	});

	describe('handleContinue', () => {
		it('should navigate the user to the batch identifiers page if the form is valid', () => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.form.patchValue({
				batchSize: 10,
			});
			component.handleContinue();
			expect(navigateSpy).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.ENTER_BATCH_IDENTIFIERS]);
		});

		it('should not navigate the user to the batch identifiers page if the form is invalid', () => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			component.form.patchValue({
				batchSize: null,
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
});
