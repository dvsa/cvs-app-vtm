import { Injectable } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import {
  EuVehicleCategories,
  PostNewVehicleModel,
  PutVehicleTechRecordModel,
  StatusCodes,
  TechRecordModel,
  V3TechRecordModel,
  VehicleTechRecordModel,
  VehicleTypes,
  Vrm
} from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/index';
import { cloneDeep, merge } from 'lodash';
import { catchError, concatMap, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import {
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
  generateLetter,
  generateLetterFailure,
  generateLetterSuccess,
  generatePlate,
  generatePlateFailure,
  generatePlateSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess,
  getTechRecordV3,
  getTechRecordV3Success,
  getTechRecordV3Failure,
  updateTechRecords2
} from '../actions/technical-record-service.actions';
import { editableTechRecord, selectTechRecord, techRecord } from '../selectors/technical-record-service.selectors';
import { StatusCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/lgv/complete';

@Injectable()
export class TechnicalRecordServiceEffects {
  constructor(
    private actions$: Actions,
    private techRecordHttpService: TechnicalRecordHttpService,
    private technicalRecordService: TechnicalRecordService,
    private batchTechRecordService: BatchTechnicalRecordService,
    private userService: UserService,
    private store: Store<State>,
    private dfs: DynamicFormService
  ) {}

  getTechnicalRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBySystemNumber),
      mergeMap(action => {
        const anchorLink = 'search-term';

        return this.techRecordHttpService.getBySystemNumber(action.systemNumber).pipe(
          map(vehicleTechRecords => {
            return getBySystemNumberSuccess({ vehicleTechRecords: vehicleTechRecords });
          }),
          catchError(error =>
            of(getBySystemNumberFailure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'systemNumber'), anchorLink }))
          )
        );
      })
    )
  );

  getTechRecordV3$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTechRecordV3),
      mergeMap(action => {
        const anchorLink = 'search-term';

        return this.techRecordHttpService.getRecordV3(action.systemNumber, action.createdTimestamp).pipe(
          map(vehicleTechRecords => {
            return getTechRecordV3Success({ vehicleTechRecords });
          }),
          catchError(error =>
            of(getTechRecordV3Failure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'systemNumber'), anchorLink }))
          )
        );
      })
    )
  );

  createVehicleRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createVehicleRecord),
      withLatestFrom(this.batchTechRecordService.applicationId$, this.userService.name$, this.userService.id$),
      concatMap(([{ vehicle }, applicationId, name, id]) => {
        const vehicleRecord = { ...vehicle, applicationId };

        return this.techRecordHttpService.createVehicleRecord(vehicleRecord).pipe(
          map(response => createVehicleRecordSuccess({ vehicleTechRecords: response })),
          catchError(error =>
            of(
              createVehicleRecordFailure({
                error: `Unable to create vehicle with VIN ${vehicle.vin}${
                  error.error?.errors ? ' because:' + (error.error.errors?.map((e: string) => '\n' + e) as string[]).join() : ''
                }`
              })
            )
          )
        );
      })
    )
  );

  createProvisionalTechRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProvisionalTechRecord),
      withLatestFrom(this.technicalRecordService.techRecord$),
      switchMap(([action, record]) =>
        this.techRecordHttpService.createProvisionalTechRecord(record!).pipe(
          map(vehicleTechRecord => createProvisionalTechRecordSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
          catchError(error => of(createProvisionalTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'createProvisionalTechRecord') })))
        )
      )
    )
  );

  updateTechRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTechRecords),
      withLatestFrom(this.store.select(selectTechRecord)),
      switchMap(([action, record]) =>
        this.techRecordHttpService.updateTechRecords(record!).pipe(
          map(vehicleTechRecord => updateTechRecordsSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
          catchError(error => of(updateTechRecordsFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') })))
        )
      )
    )
  );

  updateTechRecords2$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTechRecords2),
      switchMap(({ vehicleTechRecord }) => {
        console.log('in the action');
        return this.techRecordHttpService.updateTechRecords(vehicleTechRecord).pipe(
          map(vehicleTechRecord => updateTechRecordsSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
          catchError(error => of(updateTechRecordsFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') })))
        );
      })
    )
  );

  // updateTechRecords$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(updateTechRecords),
  //     withLatestFrom(this.technicalRecordService.editableVehicleTechRecord$, this.userService.name$, this.userService.id$),
  //     concatMap(([action, record, name, id]) =>
  //       this.techRecordHttpService.updateTechRecords(action.systemNumber, record!, { id, name }, action.recordToArchiveStatus, action.newStatus).pipe(
  //         map(vehicleTechRecord => updateTechRecordsSuccess({ vehicleTechRecords: [vehicleTechRecord] })),
  //         catchError(error => of(updateTechRecordsFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') })))
  //       )
  //     )
  //   )
  // );

  archiveTechRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(archiveTechRecord),
      withLatestFrom(this.store.select(selectTechRecord), this.userService.name$, this.userService.id$),
      switchMap(([action, record, name, id]) =>
        this.techRecordHttpService.archiveTechnicalRecord(record!).pipe(
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
        concatMap(([{ techRecord_vehicleType }, editableTechRecord]) => {
          const techRecord = { ...cloneDeep(editableTechRecord), techRecord_vehicleType };

          if (techRecord_vehicleType === VehicleTypes.SMALL_TRL) {
            techRecord.techRecord_vehicleType = VehicleTypes.TRL;
            (techRecord as any).euVehicleCategory = EuVehicleCategories.O1;
          }

          const techRecordTemplate = vehicleTemplateMap.get(techRecord_vehicleType) || [];

          return of(
            techRecordTemplate.reduce((mergedNodes, formNode) => {
              const form = this.dfs.createForm(formNode, techRecord);
              return merge(mergedNodes, form.getCleanValue(form));
            }, {}) as V3TechRecordModel
          );
        }),
        tap(mergedForms => this.technicalRecordService.updateEditingTechRecord(mergedForms))
      ),
    { dispatch: false }
  );

  generatePlate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generatePlate),
      withLatestFrom(this.store.select(selectTechRecord), this.userService.name$, this.userService.id$, this.userService.userEmail$),
      switchMap(([{ reason }, vehicle, name, id, email]) =>
        this.techRecordHttpService.generatePlate(vehicle! as any, reason, { name, id, email }).pipe(
          map(() => generatePlateSuccess()),
          catchError(error => of(generatePlateFailure({ error: this.getTechRecordErrorMessage(error, 'generatePlate') })))
        )
      )
    )
  );

  generateLetter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateLetter),
      withLatestFrom(this.store.select(selectTechRecord), this.userService.name$, this.userService.id$, this.userService.userEmail$),
      switchMap(([{ letterType, paragraphId }, vehicle, name, id, email]) =>
        this.techRecordHttpService.generateLetter(vehicle! as any, letterType, paragraphId, { name, id, email }).pipe(
          map(value => generateLetterSuccess()),
          catchError(error => of(generateLetterFailure({ error: this.getTechRecordErrorMessage(error, 'generateLetter') })))
        )
      )
    )
  );

  // updateVin$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(updateVin),
  //     withLatestFrom(this.userService.name$, this.userService.id$),
  //     switchMap(([{ newVin, systemNumber }, name, id]) =>
  //       this.techRecordHttpService.updateVin(newVin, systemNumber, { id, name }).pipe(
  //         map(() => updateVinSuccess()),
  //         catchError(error => of(updateVinFailure({ error: error })))
  //       )
  //     )
  //   )
  // );

  // mapVehicleFromResponse(response: PostNewVehicleModel | PutVehicleTechRecordModel): VehicleTechRecordModel {
  //   const vrms: Vrm[] = [];

  //   if (response.techRecord[0].vehicleType !== VehicleTypes.TRL) {
  //     response.primaryVrm && vrms.push({ vrm: response.primaryVrm, isPrimary: true });

  //     response.secondaryVrms && vrms.push(...response.secondaryVrms.map(vrm => ({ vrm, isPrimary: false })));
  //   }

  //   return { ...response, vrms };
  // }

  getTechRecordErrorMessage(error: any, type: string, search?: string): string {
    if (typeof error !== 'object') {
      return error;
    } else if (error.status === 404) {
      return this.apiErrors[type + '_404'];
    } else {
      return `${this.apiErrors[type + '_400']} ${search ?? JSON.stringify(error.error)}`;
    }
  }

  private apiErrors: Record<string, string> = {
    getTechnicalRecords_400: 'There was a problem getting the Tech Record by',
    getTechnicalRecords_404: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
    createVehicleRecord_400: 'Unable to create a new vehicle record',
    createProvisionalTechRecord_400: 'Unable to create a new provisional record',
    updateTechnicalRecord_400: 'Unable to update technical record'
  };
}
