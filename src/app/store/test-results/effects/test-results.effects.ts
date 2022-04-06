import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestResultsService } from '@services/test-results/test-results.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fetchTestResultBySystemId, fetchTestResultBySystemIdFailed, fetchTestResultBySystemIdSuccess } from '../actions/test-results.actions';

@Injectable()
export class TestResultsEffects {
  fetchTestResultBySystemId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestResultBySystemId),
      mergeMap(({ systemId }) =>
        this.testResultsService.fetchTestResultbyServiceId(systemId).pipe(
          map((testResult) => fetchTestResultBySystemIdSuccess({ payload: testResult })),
          catchError((e) => of(fetchTestResultBySystemIdFailed({ error: e })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private testResultsService: TestResultsService) {}
}
