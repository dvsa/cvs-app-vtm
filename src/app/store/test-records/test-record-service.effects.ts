import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { getBySystemId, getBySystemIdSuccess, getBySystemIdFailure } from './test-record-service.actions';
import { TestRecordService } from './test-record.service'

@Injectable()
export class TestRecordServiceEffects {

  getBySystemId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBySystemId),
      mergeMap(action => this.testRecordService.getBySystemId(action.systemId)
        .pipe(
          map(vehicleTestRecords => getBySystemIdSuccess({ testRecords: vehicleTestRecords }))),
          // catchError(() => getByVINFailure('There was a problem getting the Tech Record by VIN'))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private testRecordService: TestRecordService
  ) {}
}
