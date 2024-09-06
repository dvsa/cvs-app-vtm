import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { selectRouteData } from '@store/router/selectors/router.selectors';
import { createVehicleRecordSuccess } from '@store/technical-records';
import { ReplaySubject, firstValueFrom, of } from 'rxjs';
import { HydrateNewVehicleRecordComponent } from '../hydrate-new-vehicle-record.component';

describe('HydrateNewVehicleRecordComponent', () => {
	let component: HydrateNewVehicleRecordComponent;
	let fixture: ComponentFixture<HydrateNewVehicleRecordComponent>;
	const actions$ = new ReplaySubject<Action>();
	let errorService: GlobalErrorService;
	let route: ActivatedRoute;
	let router: Router;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [HydrateNewVehicleRecordComponent],
			providers: [
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{
					provide: UserService,
					useValue: {
						name$: of('tester'),
					},
				},
			],
			imports: [HttpClientTestingModule, RouterTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HydrateNewVehicleRecordComponent);
		route = TestBed.inject(ActivatedRoute);
		errorService = TestBed.inject(GlobalErrorService);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('get vehicle$', () => {
		it('should return the editable vehicle', async () => {
			const expectedVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };

			jest.spyOn(store, 'select').mockReturnValue(of(expectedVehicle));

			const vehicle = await firstValueFrom(component.vehicle$);
			expect(vehicle).toEqual(expectedVehicle);
		});
	});

	describe('navigate', () => {
		it('should clear all errors', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

			component.navigate();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});
		// TODO V3 HGV PSV TRL
		it('should navigate back to batch results', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.navigate();

			expect(navigateSpy).toHaveBeenCalledWith(['batch-results'], { relativeTo: route });
		});
	});

	describe('handleSubmit', () => {
		it('should not dispatch createVehicleRecord', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.isInvalid = true;

			component.handleSubmit();

			expect(dispatchSpy).not.toHaveBeenCalled();
		});

		it('should navigate back', fakeAsync(() => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			store.overrideSelector(selectRouteData, { data: { isEditing: true } });

			component.handleSubmit();

			actions$.next(
				createVehicleRecordSuccess({
					vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>,
				})
			);
			tick();

			expect(navigateSpy).toHaveBeenCalledTimes(1);
		}));
	});
});
