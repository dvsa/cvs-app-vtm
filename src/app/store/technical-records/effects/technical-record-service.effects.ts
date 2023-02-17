import { Injectable } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/index';
import { cloneDeep, merge } from 'lodash';
import { catchError, concatMap, map, mergeMap, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import {
  amendVin,
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  changeVehicleType,
  createProvisionalTechRecord,
  createProvisionalTechRecordFailure,
  createProvisionalTechRecordSuccess,
  createVehicle,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess,
  getByAll,
  getByAllFailure,
  getByAllSuccess,
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  getByTrailerId,
  getByTrailerIdFailure,
  getByTrailerIdSuccess,
  getByVin,
  getByVinFailure,
  getByVinSuccess,
  getByVrm,
  getByVrmFailure,
  getByVrmSuccess,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess,
  generatePlate,
  generatePlateSuccess,
  generatePlateFailure,
  generateLetter,
  generateLetterSuccess,
  generateLetterFailure,
  amendVinSuccess,
  amendVinFailure
} from '../actions/technical-record-service.actions';
import { editableTechRecord, selectVehicleTechnicalRecordsBySystemNumber } from '../selectors/technical-record-service.selectors';

@Injectable()
export class TechnicalRecordServiceEffects {
  constructor(
    private actions$: Actions,
    private technicalRecordService: TechnicalRecordService,
    private userService: UserService,
    private store: Store<State>,
    private dfs: DynamicFormService
  ) {}

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
          case getBySystemNumber.type:
            return this.technicalRecordService.getBySystemNumber(action.systemNumber).pipe(
              map(vehicleTechRecords => {
                return getBySystemNumberSuccess({ vehicleTechRecords: vehicleTechRecords });
              }),
              catchError(error =>
                of(getBySystemNumberFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'systemNumber'), anchorLink }))
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

  createVehicleRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createVehicleRecord),
      withLatestFrom(this.technicalRecordService.editableVehicleTechRecord$, this.userService.name$, this.userService.id$),
      switchMap(([, record, name, id]) =>
        this.technicalRecordService.createVehicleRecord(record!, { id, name }).pipe(
          map(newVehicleRecord => createVehicleRecordSuccess({ vehicleTechRecords: [newVehicleRecord] })),
          catchError(error => of(createVehicleRecordFailure({ error: this.getTechRecordErrorMessage(error, 'createVehicleRecord') })))
        )
      )
    )
  );

  createProvisionalTechRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProvisionalTechRecord),
      withLatestFrom(this.technicalRecordService.editableTechRecord$, this.userService.name$, this.userService.id$),
      switchMap(([action, record, name, id]) =>
        this.technicalRecordService.createProvisionalTechRecord(action.systemNumber, record!, { id, name }).pipe(
          map(vehicleTechRecord => createProvisionalTechRecordSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
          catchError(error => of(createProvisionalTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'createProvisionalTechRecord') })))
        )
      )
    )
  );

  updateTechRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTechRecords),
      withLatestFrom(this.technicalRecordService.editableVehicleTechRecord$, this.userService.name$, this.userService.id$),
      switchMap(([action, record, name, id]) =>
        this.technicalRecordService
          .updateTechRecords(action.systemNumber, record!, { id, name }, action.recordToArchiveStatus, action.newStatus)
          .pipe(
            map(vehicleTechRecord => updateTechRecordsSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
            catchError(error => of(updateTechRecordsFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') })))
          )
      )
    )
  );

  archiveTechRecord$ = createEffect(() =>
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

  generateTechRecordBasedOnSectionTemplates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeVehicleType, createVehicle),
        withLatestFrom(this.store.pipe(select(editableTechRecord))),
        concatMap(([{ vehicleType }, editableTechRecord]) => {
          const techRecord = { ...cloneDeep(editableTechRecord), vehicleType };

          const techRecordTemplate = vehicleTemplateMap.get(vehicleType) || [];

          return of(
            techRecordTemplate.reduce((mergedNodes, formNode) => {
              const form = this.dfs.createForm(formNode, techRecord);
              return merge(mergedNodes, form.getCleanValue(form));
            }, {}) as TechRecordModel
          );
        }),
        tap(mergedForms => this.technicalRecordService.updateEditingTechRecord(mergedForms))
      ),
    { dispatch: false }
  );

  generatePlate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generatePlate),
      withLatestFrom(
        this.store.select(selectVehicleTechnicalRecordsBySystemNumber),
        this.store.select(editableTechRecord),
        this.userService.name$,
        this.userService.id$
      ),
      switchMap(([{ reason }, vehicle, techRecord, name, id]) =>
        this.technicalRecordService.generatePlate(vehicle!, techRecord!, reason, { name, id }).pipe(
          map(() => generatePlateSuccess()),
          catchError(error => of(generatePlateFailure({ error: this.getTechRecordErrorMessage(error, 'generatePlate') })))
        )
      )
    )
  );

  generateLetter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateLetter),
      withLatestFrom(this.store.pipe(select(editableTechRecord))),
      switchMap(([{ techRecord, letterType }, record]) =>
        this.technicalRecordService.generateLetter(techRecord, letterType).pipe(
          map(value => generateLetterSuccess({ outcome: value })),
          catchError(error => of(generateLetterFailure({ error: this.getTechRecordErrorMessage(error, 'generateLetter') })))
        )
      )
    )
  );

  amendVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(amendVin),
      withLatestFrom(this.userService.name$, this.userService.id$),
      switchMap(([{ oldVin, newVin, systemNumber }, name, id]) =>
        this.technicalRecordService.amendVin(oldVin, newVin, systemNumber, { id, name }).pipe(
          map(value => amendVinSuccess()),
          catchError(error => of(amendVinFailure()))
        )
      )
    )
  );

  getTechRecordErrorMessage(error: any, type: string, search?: string): string {
    if (typeof error !== 'object') {
      return error;
    } else if (error.status === 404) {
      return this.apiErrors[type + '_404'];
    } else {
      return `${this.apiErrors[type + '_400']} ${search ?? JSON.stringify(error.error)}`;
    }
  }

  private apiErrors: { [key: string]: string } = {
    getTechnicalRecords_400: 'There was a problem getting the Tech Record by',
    getTechnicalRecords_404: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
    createVehicleRecord_400: 'Unable to create a new vehicle record',
    createProvisionalTechRecord_400: 'Unable to create a new provisional record',
    updateTechnicalRecord_400: 'Unable to update technical record'
  };
}
