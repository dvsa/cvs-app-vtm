import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestResultsService } from '@services/test-results/test-results.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fetchTestResultsBySystemId, fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess } from '../actions/test-results.actions';

@Injectable()
export class TestResultsEffects {
  fetchTestResultsBySystemId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestResultsBySystemId),
      mergeMap(({ systemId }) =>
        this.testResultsService.fetchTestResultbyServiceId(systemId).pipe(
          map((testResults) => fetchTestResultsBySystemIdSuccess({ payload: testResults })),
          catchError((e) => of(fetchTestResultsBySystemIdFailed({ error: e })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private testResultsService: TestResultsService) {}
}
