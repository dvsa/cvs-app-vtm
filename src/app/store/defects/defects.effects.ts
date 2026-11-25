import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CacheKeys } from '@models/cache-keys.enum';
import { ReferenceDataRoutes, RootRoutes } from '@models/routes.enum';
import { HttpCacheManager } from '@ngneat/cashew';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { catchError, exhaustMap, filter, map, mergeMap, of, tap } from 'rxjs';
import {
	deleteDefect,
	deleteDefectFailed,
	deleteDefectSuccess,
	fetchDefect,
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsComplete,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from './defects.actions';

@Injectable()
export class DefectsEffects {
	private store = inject(Store);
	private cacheManager = inject(HttpCacheManager);
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);
	private router = inject(Router);
	private globalErrorService = inject(GlobalErrorService);

	deleteDefect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(deleteDefect),
			exhaustMap(({ id }) =>
				this.httpService.deleteDefect(id).pipe(
					map(() => deleteDefectSuccess({ id })),
					catchError(() =>
						of(deleteDefectFailed({ error: 'The defect category could not be deleted. Please try again.' }))
					)
				)
			)
		)
	);

	deleteDefectSuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(deleteDefectSuccess),
				tap(() => {
					this.cacheManager.delete(CacheKeys.DEFECTS);
					this.globalErrorService.clearErrors();
					void this.router.navigate([RootRoutes.REFERENCE_DATA, ReferenceDataRoutes.DEFECTS], {
						queryParamsHandling: 'preserve',
					});
				})
			),
		{ dispatch: false }
	);

	deleteDefectFailed$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(deleteDefectFailed),
				tap(({ error }) => this.globalErrorService.setErrors([{ error }]))
			),
		{ dispatch: false }
	);

	fetchDefects$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchDefects),
			tap(() => {
				if (this.cacheManager.has(CacheKeys.DEFECTS)) {
					this.store.dispatch(fetchDefectsComplete());
				}
			}),
			filter(() => !this.cacheManager.has(CacheKeys.DEFECTS)),
			mergeMap(() =>
				this.httpService.fetchDefects().pipe(
					map((defects) => fetchDefectsSuccess({ payload: defects })),
					catchError((e) => of(fetchDefectsFailed({ error: e.message })))
				)
			)
		)
	);

	fetchDefect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchDefect),
			mergeMap(({ id }) =>
				this.httpService.fetchDefect(id).pipe(
					map((defect) => fetchDefectSuccess({ id, payload: defect })),
					catchError((e) => of(fetchDefectFailed({ error: e.message })))
				)
			)
		)
	);
}
