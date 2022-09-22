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
  getByAllSuccess,
  putUpdateTechRecords,
  putUpdateTechRecordsSuccess,
  putUpdateTechRecordsFailure,
  postProvisionalTechRecord,
  postProvisionalTechRecordSuccess,
  postProvisionalTechRecordFailure
} from '../actions/technical-record-service.actions';
import { Router } from '@angular/router';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Injectable()
export class TechnicalRecordServiceEffects {
  constructor(private actions$: Actions, private technicalRecordService: TechnicalRecordService, private userService: UserService, private router: Router) {}

  private getLatestRecordTimestamp(record: VehicleTechRecordModel): number {
    const sortByDate = function (a: Date, b: Date): number {
      return new Date(b).getTime() - new Date(a).getTime();
    };

    return new Date(record.techRecord.sort((a, b) => sortByDate(a.createdAt, b.createdAt))[0].createdAt).getTime()
  }

  getTechnicalRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getByVin, getByPartialVin, getByVrm, getByTrailerId, getBySystemNumber, getByAll),
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
              catchError(error => of(getByPartialVinFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'partialVin'), anchorLink })))
            );
          case getByVrm.type:
            return this.technicalRecordService.getByVrm(action.vrm).pipe(
              map(vehicleTechRecords => getByVrmSuccess({ vehicleTechRecords })),
              catchError(error => of(getByVrmFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'vrm'), anchorLink })))
            );
          case getByTrailerId.type:
            return this.technicalRecordService.getByTrailerId(action.trailerId).pipe(
              map(vehicleTechRecords => getByTrailerIdSuccess({ vehicleTechRecords })),
              catchError(error => of(getByTrailerIdFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'trailerId'), anchorLink })))
            );
          case getBySystemNumber.type:
            return this.technicalRecordService.getBySystemNumber(action.systemNumber).pipe(
              map(vehicleTechRecords => getBySystemNumberSuccess({ vehicleTechRecords })),
              catchError(error => of(getBySystemNumberFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'systemNumber'), anchorLink })))
            );
          case getByAll.type:
            return this.technicalRecordService.getByAll(action.all).pipe(
              map(vehicleTechRecords => getByAllSuccess({ vehicleTechRecords })),
              catchError(error => of(getByAllFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'the current search criteria'), anchorLink })))
            );
        }
      })
    )
  );

  updateTechnicalRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(putUpdateTechRecords),
      withLatestFrom(this.technicalRecordService.techRecord$, this.userService.userName$, this.userService.id$),
      switchMap(([action, record, username, id]) =>
        this.technicalRecordService.putUpdateTechRecords(action.systemNumber, record!, { username, id }, action.oldStatusCode).pipe(
          map(vehicleTechRecords => {
            putUpdateTechRecordsSuccess({ vehicleTechRecords: [vehicleTechRecords] })
            this.router.navigateByUrl(`/tech-records/${action.systemNumber}/${this.getLatestRecordTimestamp(vehicleTechRecords)}`)
          }),
          catchError(error => of(putUpdateTechRecordsFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') }))),
        )
      )
    )
  );

  postProvisionalTechRecord = createEffect(() => 
    this.actions$.pipe(
      ofType(postProvisionalTechRecord),
      withLatestFrom(this.technicalRecordService.techRecord$, this.userService.userName$, this.userService.id$),
      switchMap(([action, record, username, id]) =>
        this.technicalRecordService.postProvisionalTechRecord(action.systemNumber, record!, { username, id }).pipe(
          map(vehicleTechRecords => {
            postProvisionalTechRecordSuccess({ vehicleTechRecords: [vehicleTechRecords]})
            this.router.navigateByUrl(`/tech-records/${action.systemNumber}/${this.getLatestRecordTimestamp(vehicleTechRecords)}`)
          }),
          catchError(error => of(postProvisionalTechRecordFailure({ error: this.getTechRecordErrorMessage(error,'postProvisionalTechRecord')}))),
        )
      )
    )
  )

  private apiErrors: { [key: string]: string } = {
    updateTechnicalRecord_400: "Unable to update technical record",
    postProvisionalTechRecord_400: "Unable to create a new provisional record",
    getTechnicalRecords_400: "There was a problem getting the Tech Record by",
    getTechnicalRecords_404: "Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number"
  }

  getTechRecordErrorMessage(error: any, type: string, search?: string): string {
    if (typeof error !== 'object') {
      return error;
    }

    switch (error.status) {
      case 404:
        return this.apiErrors[`${type}_404`]
      default:
        return `${this.apiErrors[`${type}_400`]} ${search ? search : JSON.stringify(error.error)}`
    }
  }
}