import { Injectable } from '@angular/core';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { catchError, map, mergeMap, of, take, withLatestFrom } from 'rxjs';
import {
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';

@Injectable()
export class TestResultsEffects {
  fetchTestResultsBySystemNumber$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestResultsBySystemNumber),
      mergeMap(({ systemNumber }) =>
        this.testRecordsService.fetchTestResultbySystemNumber(systemNumber).pipe(
          map(testResults => fetchTestResultsBySystemNumberSuccess({ payload: testResults })),
          catchError(e => {
            switch (e.status) {
              case 404:
                return of(fetchTestResultsBySystemNumberSuccess({ payload: [] as TestResultModel[] }));
            }
            return of(fetchTestResultsBySystemNumberFailed({ error: e.message }));
          })
        )
      )
    )
  );

  fetchSelectedTestResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchSelectedTestResult),
      mergeMap(() => this.store.pipe(select(selectRouteNestedParams), take(1))),
      mergeMap(params => {
        const { systemNumber, testResultId } = params;
        return this.testRecordsService.fetchTestResultbySystemNumber(systemNumber, { testResultId, version: 'all' }).pipe(
          map(vehicleTestRecords => {
            if (vehicleTestRecords && vehicleTestRecords.length === 1) {
              return fetchSelectedTestResultSuccess({ payload: vehicleTestRecords[0] });
            } else {
              return fetchSelectedTestResultFailed({ error: 'Test result not found' });
            }
          }),
          catchError(e => {
            return of(fetchSelectedTestResultFailed({ error: e.message }));
          })
        );
      })
    )
  );

  /**
   * Call PUT Test Results API to update test result
   */
  updateTestResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTestResult),
      mergeMap(action =>
        of(action.value).pipe(
          withLatestFrom(this.userService.userName$, this.userService.id$, this.routerService.getRouteParam$('systemNumber')),
          take(1)
        )
      ),
      mergeMap(([testResult, username, id, systemNumber]) => {
        return this.testRecordsService.saveTestResult(systemNumber!, { username, id }, testResult).pipe(
          take(1),
          map(responseBody => updateTestResultSuccess({ payload: { id: responseBody.testResultId, changes: responseBody } })),
          catchError(e => {
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
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private testRecordsService: TestRecordsService,
    private store: Store<State>,
    private userService: UserService,
    private routerService: RouterService
  ) {}
}
