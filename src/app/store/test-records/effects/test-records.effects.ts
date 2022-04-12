import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { getByVINSuccess } from '@store/technical-records';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fetchTestResultsBySystemId, fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess } from '../actions/test-records.actions';

@Injectable()
export class TestResultsEffects {
  fetchTestResultsBySystemNumber$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestResultsBySystemId),
      mergeMap(({ systemId }) =>
        this.testRecordsService.fetchTestResultbySystemId(systemId).pipe(
          map((testResults) => fetchTestResultsBySystemIdSuccess({ payload: testResults })),
          catchError((e) => of(fetchTestResultsBySystemIdFailed({ error: e })))
        )
      )
    )
  );

  getByVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVINSuccess),
      mergeMap((action) =>
        this.testRecordsService.fetchTestResultbySystemId(action.vehicleTechRecords[0].systemNumber).pipe(
          map((vehicleTestRecords) => fetchTestResultsBySystemIdSuccess({ payload: vehicleTestRecords })),
          catchError((e) => of(fetchTestResultsBySystemIdFailed({ error: e })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private testRecordsService: TestRecordsService) {}
}
