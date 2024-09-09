import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpService } from '@services/http/http.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
	fetchTestStation,
	fetchTestStationFailed,
	fetchTestStationSuccess,
	fetchTestStations,
	fetchTestStationsFailed,
	fetchTestStationsSuccess,
} from './test-stations.actions';

@Injectable()
export class TestStationsEffects {
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);

	fetchTestStations$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTestStations),
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
