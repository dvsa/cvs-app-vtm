import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { getByPartialVIN, getByPartialVINFailure, getByPartialVINSuccess, getByVIN, getByVINFailure, getByVINSuccess } from '../actions/technical-record-service.actions';

@Injectable()
export class TechnicalRecordServiceEffects {
  getByVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVIN),
      mergeMap((action) =>
        this.technicalRecordService.getByVIN(action.vin).pipe(
          map((vehicleTechRecords) => getByVINSuccess({ vehicleTechRecords })),
          catchError((error) => {
            let message = error;

            if (typeof error === 'object') {
              if (error.status === 404) {
                message = 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number';
              } else {
                message = 'There was a problem getting the Tech Record by VIN';
              }
            }

            return of(getByVINFailure({ error: message, anchorLink: 'search-term' }));
          })
        )
      )
    )
  );

  getByPartialVIN$ = createEffect(() => 
    this.actions$.pipe(
      ofType(getByPartialVIN),
      mergeMap((action) => 
        this.technicalRecordService.getByPartialVIN(action.partialVin).pipe(
          map(vehicleTechRecords => getByPartialVINSuccess({ vehicleTechRecords })),
          catchError((error) => {
            let message = error;

            if (typeof error === 'object') {
              if (error.status === 404) {
                message = 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number';
              } else {
                message = 'There was a problem getting the Tech Record by partialVIN';
              }
            }

            return of(getByPartialVINFailure({ error: message, anchorLink: 'search-term'}))
          })
        )
      )
    )
  )

  constructor(private actions$: Actions, private technicalRecordService: TechnicalRecordService) {}
}
