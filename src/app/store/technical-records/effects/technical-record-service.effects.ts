import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getBySystemNumber,
  getBySystemNumberSuccess,
  getBySystemNumberFailure,
  getByTrailerId,
  getByTrailerIdFailure,
  getByTrailerIdSuccess,
  getByVin,
  getByVinFailure,
  getByVinSuccess,
  getByVrm,
  getByVrmFailure,
  getByVrmSuccess,
  getByAll,
  getByAllFailure,
  getByAllSuccess
} from '../actions/technical-record-service.actions';

@Injectable()
export class TechnicalRecordServiceEffects {
  constructor(private actions$: Actions, private technicalRecordService: TechnicalRecordService) {}

  getTechnicalRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVin, getByPartialVin, getByVrm, getByTrailerId, getBySystemNumber, getByAll),
      mergeMap(action => {
        const anchorLink = 'search-term';

        switch (action.type) {
          case getByVin.type:
            return this.technicalRecordService.getByVin(action.vin).pipe(
              map(vehicleTechRecords => getByVinSuccess({ vehicleTechRecords })),
              catchError(error => of(getByVinFailure({ error: this.getErrorMessage(error, 'vin'), anchorLink })))
            );
          case getByPartialVin.type:
            return this.technicalRecordService.getByPartialVin(action.partialVin).pipe(
              map(vehicleTechRecords => getByPartialVinSuccess({ vehicleTechRecords })),
              catchError(error => of(getByPartialVinFailure({ error: this.getErrorMessage(error, 'partialVin'), anchorLink })))
            );
          case getByVrm.type:
            return this.technicalRecordService.getByVrm(action.vrm).pipe(
              map(vehicleTechRecords => getByVrmSuccess({ vehicleTechRecords })),
              catchError(error => of(getByVrmFailure({ error: this.getErrorMessage(error, 'vrm'), anchorLink })))
            );
          case getByTrailerId.type:
            return this.technicalRecordService.getByTrailerId(action.trailerId).pipe(
              map(vehicleTechRecords => getByTrailerIdSuccess({ vehicleTechRecords })),
              catchError(error => of(getByTrailerIdFailure({ error: this.getErrorMessage(error, 'trailerId'), anchorLink })))
            );
          case getBySystemNumber.type:
            return this.technicalRecordService.getBySystemNumber(action.systemNumber).pipe(
              map(vehicleTechRecords => getBySystemNumberSuccess({ vehicleTechRecords })),
              catchError(error => of(getBySystemNumberFailure({ error: this.getErrorMessage(error, 'systemNumber'), anchorLink })))
            );
          case getByAll.type:
            return this.technicalRecordService.getByAll(action.all).pipe(
              map(vehicleTechRecords => getByAllSuccess({ vehicleTechRecords })),
              catchError(error => of(getByAllFailure({ error: this.getErrorMessage(error, 'the current search criteria'), anchorLink })))
            );
        }
      })
    )
  );

  getErrorMessage(error: any, search: string): string {
    if (typeof error !== 'object') {
      return error;
    }

    return error.status === 404
      ? 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number'
      : `There was a problem getting the Tech Record by ${search}`;
  }
}
