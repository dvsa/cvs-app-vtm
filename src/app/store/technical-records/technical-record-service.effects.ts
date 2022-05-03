import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { getByVIN, getByVINFailure, getByVINSuccess } from './technical-record-service.actions';

@Injectable()
export class TechnicalRecordServiceEffects {
  getByVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVIN),
      mergeMap((action) =>
        this.technicalRecordService.getByVIN(action.vin).pipe(
          map((vehicleTechRecords) => getByVINSuccess({ vehicleTechRecords })),
          catchError(() => of(getByVINFailure({ error: 'There was a problem getting by VIN', anchorLink: '' })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private technicalRecordService: TechnicalRecordService) {}
}
