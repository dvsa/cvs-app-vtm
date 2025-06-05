import { Injectable, inject } from '@angular/core';
import { CacheKeys } from '@models/cache-keys.enum';
import { HttpCacheManager } from '@ngneat/cashew';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import {
	fetchTestStation,
	fetchTestStationFailed,
	fetchTestStationSuccess,
	fetchTestStations,
	fetchTestStationsComplete,
	fetchTestStationsFailed,
	fetchTestStationsSuccess,
} from './test-stations.actions';

@Injectable()
export class TestStationsEffects {
	private store = inject(Store);
	private cacheManager = inject(HttpCacheManager);
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);

	fetchTestStations$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTestStations),
			tap(() => {
				if (this.cacheManager.has(CacheKeys.TEST_STATIONS)) {
					this.store.dispatch(fetchTestStationsComplete());
				}
			}),
			filter(() => !this.cacheManager.has(CacheKeys.TEST_STATIONS)),
			mergeMap(() =>
				this.httpService.fetchTestStations().pipe(
					map((testStations) => fetchTestStationsSuccess({ payload: testStations })),
					catchError((e) => of(fetchTestStationsFailed({ error: e.message })))
				)
			)
		)
	);

	fetchTestStation$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTestStation),
			mergeMap(({ id }) =>
				this.httpService.fetchTestStation(id).pipe(
					map((testStation) => fetchTestStationSuccess({ id, payload: testStation })),
					catchError((e) => of(fetchTestStationFailed({ error: e.message })))
				)
			)
		)
	);
}
