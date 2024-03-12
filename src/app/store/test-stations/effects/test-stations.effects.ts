import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import {
  catchError, iif, map, mergeMap, of,
} from 'rxjs';
import {
  fetchTestStation,
  fetchTestStationFailed,
  fetchTestStationSuccess,
  fetchTestStations,
  fetchTestStationsFailed,
  fetchTestStationsSuccess,
  setTestStationsLoading,
} from '../actions/test-stations.actions';

@Injectable()
export class TestStationsEffects {
  fetchTestStationsRequest$ = () => this.testStationsService.fetchTestStations().pipe(
    map((testStations) => fetchTestStationsSuccess({ payload: testStations })),
    catchError((e) => of(fetchTestStationsFailed({ error: e.message }))),
  );

  fetchTestStations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestStations),
      mergeMap(
        () =>
          iif(
            () =>
              this.testStationsService.cacheBucket.has(this.testStationsService.getFetchTestStationsCacheKey()),
            of(setTestStationsLoading({ loading: false })),
            this.fetchTestStationsRequest$(),
          ),
      ),
    ));

  fetchTestStationRequest$ = (id: string) => this.testStationsService.fetchTestStation(id).pipe(
    map((testStation) => fetchTestStationSuccess({ id, payload: testStation })),
    catchError((e) => of(fetchTestStationFailed({ error: e.message }))),
  );

  fetchTestStation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestStation),
      mergeMap(({ id }) =>
        iif(
          () =>
            this.testStationsService.cacheBucket.has(this.testStationsService.getFetchTestStationCacheKey(id)),
          of(setTestStationsLoading({ loading: false })),
          this.fetchTestStationRequest$(id),
        )),
    ));

  constructor(private actions$: Actions, private testStationsService: TestStationsService) { }
}
