import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { UserService } from '@services/user-service/user-service';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getBySystemNumberAndVin,
  getBySystemNumberAndVinSuccess,
  getBySystemNumberAndVinFailure,
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
  getByAllSuccess,
  updateTechRecords,
  updateTechRecordsSuccess,
  updateTechRecordsFailure,
  createProvisionalTechRecord,
  createProvisionalTechRecordSuccess,
  createProvisionalTechRecordFailure,
  archiveTechRecord,
  archiveTechRecordSuccess,
  archiveTechRecordFailure
} from '../actions/technical-record-service.actions';
import { Router } from '@angular/router';

@Injectable()
export class TechnicalRecordServiceEffects {
  constructor(
    private actions$: Actions,
    private technicalRecordService: TechnicalRecordService,
    private userService: UserService,
    private router: Router
  ) {}

  getTechnicalRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVin, getByPartialVin, getByVrm, getByTrailerId, getBySystemNumberAndVin, getByAll),
      mergeMap(action => {
        const anchorLink = 'search-term';

        switch (action.type) {
          case getByVin.type:
            return this.technicalRecordService.getByVin(action.vin).pipe(
              map(vehicleTechRecords => getByVinSuccess({ vehicleTechRecords })),
              catchError(error => of(getByVinFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'vin'), anchorLink })))
            );
          case getByPartialVin.type:
            return this.technicalRecordService.getByPartialVin(action.partialVin).pipe(
              map(vehicleTechRecords => getByPartialVinSuccess({ vehicleTechRecords })),
              catchError(error =>
                of(getByPartialVinFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'partialVin'), anchorLink }))
              )
            );
          case getByVrm.type:
            return this.technicalRecordService.getByVrm(action.vrm).pipe(
              map(vehicleTechRecords => getByVrmSuccess({ vehicleTechRecords })),
              catchError(error => of(getByVrmFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'vrm'), anchorLink })))
            );
          case getByTrailerId.type:
            return this.technicalRecordService.getByTrailerId(action.trailerId).pipe(
              map(vehicleTechRecords => getByTrailerIdSuccess({ vehicleTechRecords })),
              catchError(error =>
                of(getByTrailerIdFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'trailerId'), anchorLink }))
              )
            );
          case getBySystemNumberAndVin.type:
            return this.technicalRecordService.getBySystemNumber(action.systemNumber).pipe(
              map(vehicleTechRecords => {
                const filteredByVinRecords = vehicleTechRecords.filter(record => record.vin === action.vin);
                return getBySystemNumberAndVinSuccess({ vehicleTechRecords: filteredByVinRecords });
              }),
              catchError(error =>
                of(
                  getBySystemNumberAndVinFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'systemNumber'), anchorLink })
                )
              )
            );
          case getByAll.type:
            return this.technicalRecordService.getByAll(action.all).pipe(
              map(vehicleTechRecords => getByAllSuccess({ vehicleTechRecords })),
              catchError(error =>
                of(
                  getByAllFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'the current search criteria'), anchorLink })
                )
              )
            );
        }
      })
    )
  );

  updateTechnicalRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTechRecords),
      withLatestFrom(this.technicalRecordService.editableTechRecord$, this.userService.name$, this.userService.id$),
      switchMap(([action, record, name, id]) =>
        this.technicalRecordService
          .putUpdateTechRecords(action.systemNumber, record!, { id, name }, action.recordToArchiveStatus, action.newStatus)
          .pipe(
            map(vehicleTechRecord => updateTechRecordsSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
            catchError(error => of(updateTechRecordsFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') })))
          )
      )
    )
  );

  postProvisionalTechRecord = createEffect(() =>
    this.actions$.pipe(
      ofType(createProvisionalTechRecord),
      withLatestFrom(this.technicalRecordService.editableTechRecord$, this.userService.name$, this.userService.id$),
      switchMap(([action, record, name, id]) =>
        this.technicalRecordService.postProvisionalTechRecord(action.systemNumber, record!, { id, name }).pipe(
          map(vehicleTechRecord => createProvisionalTechRecordSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
          catchError(error => of(createProvisionalTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'createProvisionalTechRecord') })))
        )
      )
    )
  );

  archiveTechRecord = createEffect(() =>
    this.actions$.pipe(
      ofType(archiveTechRecord),
      withLatestFrom(this.technicalRecordService.editableTechRecord$, this.userService.name$, this.userService.id$),
      switchMap(([action, record, name, id]) =>
        this.technicalRecordService.archiveTechnicalRecord(action.systemNumber, record!, action.reasonForArchiving, { id, name }).pipe(
          map(vehicleTechRecord => archiveTechRecordSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
          catchError(error => of(archiveTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'archiveTechRecord') })))
        )
      )
    )
  );

  private apiErrors: { [key: string]: string } = {
    updateTechnicalRecord_400: 'Unable to update technical record',
    createProvisionalTechRecord_400: 'Unable to create a new provisional record',
    getTechnicalRecords_400: 'There was a problem getting the Tech Record by',
    getTechnicalRecords_404: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number'
  };

  getTechRecordErrorMessage(error: any, type: string, search?: string): string {
    if (typeof error !== 'object') {
      return error;
    }

    switch (error.status) {
      case 404:
        return this.apiErrors[type + '_404'];
      default:
        return `${this.apiErrors[type + '_400']} ${search ? search : JSON.stringify(error.error)}`;
    }
  }
}
