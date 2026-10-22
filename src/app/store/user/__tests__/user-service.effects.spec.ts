import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { Observable, of } from 'rxjs';
import { Login } from '../user-service.actions';
import { UserServiceEffects } from '../user-service.effects';

describe('UserServiceEffects', () => {
	let effects: UserServiceEffects;
	let actions$: Observable<Action>;
	let analyticsService: Pick<jest.Mocked<AnalyticsService>, 'pushToDataLayer'>;

	beforeEach(() => {
		analyticsService = { pushToDataLayer: jest.fn() };

		TestBed.configureTestingModule({
			providers: [
				UserServiceEffects,
				provideMockActions(() => actions$),
				{ provide: AnalyticsService, useValue: analyticsService },
			],
		});

		effects = TestBed.inject(UserServiceEffects);
	});

	describe('onLogin', () => {
		it('should push the staff role to analytics when Login is dispatched', () => {
			actions$ = of(
				Login({
					name: 'Test User',
					userEmail: 'test@example.com',
					oid: 'test-oid',
					employeeId: 'test-employee-id',
					jobTitle: 'Vehicle Examiner',
				})
			);

			effects.onLogin.subscribe();

			expect(analyticsService.pushToDataLayer).toHaveBeenCalledTimes(1);
			expect(analyticsService.pushToDataLayer).toHaveBeenCalledWith({ StaffRole: 'Vehicle Examiner' });
		});
	});
});
