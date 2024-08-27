import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
	fetchTestStation,
	fetchTestStationFailed,
	fetchTestStationSuccess,
	fetchTestStations,
	fetchTestStationsFailed,
	fetchTestStationsSuccess,
} from '../actions/test-stations.actions';

@Injectable()
export class TestStationsEffects {
	private actions$ = inject(Actions);
	private testStationsService = inject(TestStationsService);

	fetchTestStations$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTestStations),
			mergeMap(() =>
				this.testStationsService.fetchTestStations().pipe(
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
				this.testStationsService.fetchTestStation(id).pipe(
					map((testStation) => fetchTestStationSuccess({ id, payload: testStation })),
					catchError((e) => of(fetchTestStationFailed({ error: e.message })))
				)
			)
		)
	);
}
