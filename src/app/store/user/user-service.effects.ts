import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { Login } from './user-service.actions';

@Injectable()
export class UserServiceEffects {
	readonly actions = inject(Actions);
	readonly analyticsSerivce = inject(AnalyticsService);

	readonly onLogin = createEffect(
		() =>
			this.actions.pipe(
				ofType(Login),
				tap(({ jobTitle }) => {
					this.analyticsSerivce.pushToDataLayer({ StaffRole: jobTitle });
				})
			),
		{ dispatch: false }
	);
}
