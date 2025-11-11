import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
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
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{
					provide: UserService,
					useValue: {
						name$: of('tester'),
					},
				},
			],
			imports: [HydrateNewVehicleRecordComponent],
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
			Object.defineProperty(component, 'summary', { value: signal({ checkForms: () => true }) as any });
			component.handleSubmit();

			expect(dispatchSpy).not.toHaveBeenCalled();
		});
	});
});
