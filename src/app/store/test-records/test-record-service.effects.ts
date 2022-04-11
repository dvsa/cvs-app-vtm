import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { getBySystemId, getBySystemIdSuccess, getBySystemIdFailure } from './test-record-service.actions';
import { TestRecordService } from '../../services/test-record-service/test-record.service'
import { getByVINSuccess } from '../technical-records/technical-record-service.actions';

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

  getByVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVINSuccess),
      mergeMap(action => this.testRecordService.getBySystemId(action.vehicleTechRecords[0].systemNumber)
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
