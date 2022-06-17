import { Injectable } from '@angular/core';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getByVINSuccess } from '@store/technical-records';
import { catchError, concatMap, map, mergeMap, of, take, withLatestFrom } from 'rxjs';
import {
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResultsBySystemId,
  fetchTestResultsBySystemIdFailed,
  fetchTestResultsBySystemIdSuccess,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';

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
      ofType(getByVINSuccess),
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
      mergeMap(() => this.store.pipe(select(selectRouteNestedParams), take(1))),
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

  updateTestResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTestResult),
      mergeMap(() => this.testRecordsService.testResult$.pipe(withLatestFrom(this.userService.userName$, this.userService.id$))),
      concatMap(([testResult, username, id]) =>
        this.testRecordsService.saveTestResult({ username, id }, testResult!).pipe(
          take(1),
          map(() => updateTestResultSuccess()),
          catchError((e) => {
            const validationsErrors: GlobalError[] = [];
            if (e.status === 400) {
              const {
                error: { errors }
              } = e;
              errors.forEach((error: string) => {
                const field = error.match(/"([^"]+)"/);
                validationsErrors.push({ error, anchorLink: field && field.length > 1 ? field[1].replace('"', '') : '' });
              });
            }
            return of(updateTestResultFailed({ errors: validationsErrors }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private testRecordsService: TestRecordsService,
    private store: Store<State>,
    private userService: UserService
  ) {}
}
