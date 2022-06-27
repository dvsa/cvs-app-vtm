import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getByVinSuccess } from '@store/technical-records';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess, fetchTestResultsBySystemId, fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess } from '../actions/test-records.actions';

@Injectable()
export class TestResultsEffects {
  fetchTestResultsBySystemNumber$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestResultsBySystemId),
      mergeMap(({ systemId }) =>
        this.testRecordsService.fetchTestResultbySystemId(systemId).pipe(
          map((testResults) => fetchTestResultsBySystemIdSuccess({ payload: testResults })),
          catchError((e) => of(fetchTestResultsBySystemIdFailed({ error: e.message })))
        )
      )
    )
  );

  fetchTestResultsBySystemNumberAfterSearchByVinSucces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVinSuccess),
      mergeMap((action) =>
        this.testRecordsService.fetchTestResultbySystemId(action.vehicleTechRecords[0].systemNumber).pipe(
          map((vehicleTestRecords) => fetchTestResultsBySystemIdSuccess({ payload: vehicleTestRecords })),
          catchError((e) => {
            if (e.status != 404) {
              return of(fetchTestResultsBySystemIdFailed({ error: e.message }));
            } else {
              return of(fetchTestResultsBySystemIdSuccess({ payload: [] }));
            }
          })
        )
      )
    )
  );

  fetchSelectedTestResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchSelectedTestResult),
      mergeMap(() => this.store.pipe(select(selectRouteNestedParams))),
      mergeMap((params) => {
        const { systemId, testResultId } = params;
        return this.testRecordsService.fetchTestResultbySystemId(systemId, { testResultId, version: 'all' }).pipe(
          map((vehicleTestRecords) => {
            if (vehicleTestRecords && vehicleTestRecords.length === 1) {
              return fetchSelectedTestResultSuccess({ payload: vehicleTestRecords[0] });
            } else {
              return fetchSelectedTestResultFailed({ error: 'Test result not found' });
            }
          }),
          catchError((e) => {
            return of(fetchSelectedTestResultFailed({ error: e.message }));
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private testRecordsService: TestRecordsService, private store: Store<State>) {}
}
