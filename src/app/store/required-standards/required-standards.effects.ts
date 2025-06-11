import { Injectable, inject } from '@angular/core';
import { CacheKeys } from '@models/cache-keys.enum';
import { HttpCacheManager } from '@ngneat/cashew';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import {
	getRequiredStandards,
	getRequiredStandardsComplete,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from './required-standards.actions';

@Injectable()
export class RequiredStandardsEffects {
	private store = inject(Store);
	private cacheManager = inject(HttpCacheManager);
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);

	getRequiredStandards$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getRequiredStandards),
			tap(({ euVehicleCategory }) => {
				if (this.cacheManager.has(CacheKeys.REQUIRED_STANDARDS + euVehicleCategory)) {
					this.store.dispatch(getRequiredStandardsComplete());
				}
			}),
			filter(({ euVehicleCategory }) => !this.cacheManager.has(CacheKeys.REQUIRED_STANDARDS + euVehicleCategory)),
			mergeMap(({ euVehicleCategory }) =>
				this.httpService.fetchRequiredStandards(euVehicleCategory).pipe(
					map((requiredStandards) => getRequiredStandardsSuccess({ requiredStandards })),
					catchError((e) => of(getRequiredStandardsFailure({ error: e.message })))
				)
			)
		)
	);
}
