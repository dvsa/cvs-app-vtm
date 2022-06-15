import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { getByPartialVIN, getByPartialVINFailure, getByPartialVINSuccess, getByVIN, getByVINFailure, getByVINSuccess } from '../actions/technical-record-service.actions';

function getErrorMessage(error: any, search: string): string {
  let message = error;
  if (typeof error === 'object') {
    if (error.status === 404) {
      message = 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number';
    } else {
      message = `There was a problem getting the Tech Record by ${search}`;
    }
  }
  return message
}

@Injectable()
export class TechnicalRecordServiceEffects {
  getTechnicalRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVIN, getByPartialVIN),
      mergeMap((action) => {
        switch (action.type) {
          case (getByVIN.type):
            return this.technicalRecordService.getByVIN(action.vin).pipe(
              map((vehicleTechRecords) => getByVINSuccess({ vehicleTechRecords })),
              catchError((error) => {
                return of(getByVINFailure({ error: getErrorMessage(error, 'vin'), anchorLink: 'search-term' }));
              })
            )
          case (getByPartialVIN.type): 
            return this.technicalRecordService.getByPartialVIN(action.partialVin).pipe(
              map(vehicleTechRecords => getByPartialVINSuccess({ vehicleTechRecords })),
              catchError((error) => {
                return of(getByPartialVINFailure({ error: getErrorMessage(error, 'partialVin'), anchorLink: 'search-term'}))
              })
            )
        }
      })
    )
  );

  constructor(private actions$: Actions, private technicalRecordService: TechnicalRecordService) {}
}
