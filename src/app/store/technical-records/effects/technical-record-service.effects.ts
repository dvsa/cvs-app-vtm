import { Injectable } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { EuVehicleCategories, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/index';
import { cloneDeep, merge } from 'lodash';
import {
  catchError, concatMap, map, mergeMap, of, switchMap, tap, withLatestFrom,
} from 'rxjs';
import {
  amendVrm,
  amendVrmFailure,
  amendVrmSuccess,
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  changeVehicleType,
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
  getTechRecordV3,
  getTechRecordV3Failure,
  getTechRecordV3Success,
  promoteTechRecord,
  promoteTechRecordFailure,
  promoteTechRecordSuccess,
  updateTechRecord,
  updateTechRecordFailure,
  updateTechRecordSuccess,
  unarchiveTechRecord,
  unarchiveTechRecordFailure,
  unarchiveTechRecordSuccess,
  amendVin,
  amendVinSuccess,
} from '../actions/technical-record-service.actions';
import { editingTechRecord, selectTechRecord } from '../selectors/technical-record-service.selectors';

@Injectable()
export class TechnicalRecordServiceEffects {
  constructor(
    private actions$: Actions,
    private techRecordHttpService: TechnicalRecordHttpService,
    private technicalRecordService: TechnicalRecordService,
    private batchTechRecordService: BatchTechnicalRecordService,
    private userService: UserService,
    private store: Store<State>,
    private dfs: DynamicFormService,
  ) { }

  getTechnicalRecordHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBySystemNumber),
      mergeMap((action) => {
        const anchorLink = 'search-term';

        return this.techRecordHttpService.getBySystemNumber$(action.systemNumber).pipe(
          map((vehicleTechRecords) => {
            return getBySystemNumberSuccess({ techRecordHistory: vehicleTechRecords });
          }),
          catchError(() => of(getBySystemNumberFailure({ error: 'could not find technical record history', anchorLink }))),
        );
      }),
    ));

  getTechRecordV3$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTechRecordV3),
      mergeMap((action) => {
        const anchorLink = 'search-term';

        return this.techRecordHttpService.getRecordV3$(action.systemNumber, action.createdTimestamp).pipe(
          map((vehicleTechRecord) => {
            return getTechRecordV3Success({ vehicleTechRecord });
          }),
          catchError((error) =>
            of(getTechRecordV3Failure({ error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'systemNumber'), anchorLink }))),
        );
      }),
    ));

  createVehicleRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createVehicleRecord),
      withLatestFrom(this.batchTechRecordService.applicationId$, this.userService.name$, this.userService.id$),
      concatMap(([{ vehicle }, applicationId]) => {
        const vehicleRecord = { ...vehicle, applicationId };

        return this.techRecordHttpService.createVehicleRecord$(vehicleRecord).pipe(
          map((response) => createVehicleRecordSuccess({ vehicleTechRecord: response })),
          catchError((error) =>
            of(
              createVehicleRecordFailure({
                error: `Unable to create vehicle with VIN ${vehicle.vin}${error.error?.errors
                  ? ` because:${(error.error.errors?.map((e: string) => `\n${e}`) as string[]).join()}`
                  : ''
                }`,
              }),
            )),
        );
      }),
    ));

  updateTechRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTechRecord),
      withLatestFrom(this.store.pipe(select(editingTechRecord))),
      concatMap(([{ systemNumber, createdTimestamp }, techRecord]) => {
        if (!techRecord) {
          return of(updateTechRecordFailure({ error: 'There is not technical record in edit' }));
        }
        return this.techRecordHttpService.updateTechRecords$(systemNumber, createdTimestamp, techRecord).pipe(
          map((vehicleTechRecord) => updateTechRecordSuccess({ vehicleTechRecord })),
          catchError((error) => of(updateTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') }))),
        );
      }),
    ));

  amendVrm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(amendVrm),
      switchMap(({
        newVrm, cherishedTransfer, systemNumber, createdTimestamp, thirdMark,
      }) => {
        return this.techRecordHttpService.amendVrm$(newVrm, cherishedTransfer, systemNumber, createdTimestamp, thirdMark).pipe(
          map((vehicleTechRecord) => amendVrmSuccess({ vehicleTechRecord })),
          catchError((error) => of(amendVrmFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') }))),
        );
      }),
    ));

  amendVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(amendVin),
      switchMap(({ newVin, systemNumber, createdTimestamp }) => {
        return this.techRecordHttpService.amendVin$(newVin, systemNumber, createdTimestamp).pipe(
          map((vehicleTechRecord) => amendVinSuccess({ vehicleTechRecord })),
          catchError((error) => of(amendVrmFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') }))),
        );
      }),
    ));

  archiveTechRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(archiveTechRecord),
      switchMap(({ systemNumber, createdTimestamp, reasonForArchiving }) =>
        this.techRecordHttpService.archiveTechnicalRecord$(systemNumber, createdTimestamp, reasonForArchiving).pipe(
          map((vehicleTechRecord) => archiveTechRecordSuccess({ vehicleTechRecord })),
          catchError((error) => of(archiveTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'archiveTechRecord') }))),
        )),
    ));

  promoteTechRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(promoteTechRecord),
      switchMap(({ systemNumber, createdTimestamp, reasonForPromoting }) =>
        this.techRecordHttpService.promoteTechnicalRecord$(systemNumber, createdTimestamp, reasonForPromoting).pipe(
          map((vehicleTechRecord) => promoteTechRecordSuccess({ vehicleTechRecord })),
          catchError((error) => of(promoteTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'promoteTechRecord') }))),
        )),
    ));
  generateTechRecordBasedOnSectionTemplates$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeVehicleType, createVehicle),
        withLatestFrom(this.store.pipe(select(editingTechRecord))),
        concatMap(([{ techRecord_vehicleType }, editableTechRecord]) => {
          const techRecord = { ...cloneDeep(editableTechRecord), techRecord_vehicleType };

          if (techRecord_vehicleType === VehicleTypes.SMALL_TRL) {
            techRecord.techRecord_vehicleType = VehicleTypes.TRL;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (techRecord as any).euVehicleCategory = EuVehicleCategories.O1;
          }
          if (techRecord.techRecord_vehicleType === VehicleTypes.HGV || techRecord.techRecord_vehicleType === VehicleTypes.PSV ) {
            (techRecord as any).techRecord_vehicleConfiguration = null;
          }
          const techRecordTemplate = vehicleTemplateMap.get(techRecord_vehicleType) || [];

          return of(
            techRecordTemplate.reduce((mergedNodes, formNode) => {
              const form = this.dfs.createForm(formNode, techRecord);
              return merge(mergedNodes, form.getCleanValue(form));
            }, {}) as TechRecordType<'put'>,
          );
        }),
        tap((mergedForms) => this.technicalRecordService.updateEditingTechRecord(mergedForms)),
      ),
    { dispatch: false },
  );

  generatePlate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generatePlate),
      withLatestFrom(this.store.select(selectTechRecord), this.userService.name$, this.userService.userEmail$),
      switchMap(([{ reason }, vehicle, name, email]) =>
        this.techRecordHttpService.generatePlate$(vehicle as TechRecordType<'get'>, reason, { name, email }).pipe(
          map(() => generatePlateSuccess()),
          catchError((error) => of(generatePlateFailure({ error: this.getTechRecordErrorMessage(error, 'generatePlate') }))),
        )),
    ));

  generateLetter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generateLetter),
      withLatestFrom(this.store.select(selectTechRecord), this.userService.name$, this.userService.userEmail$),
      switchMap(([{ letterType, paragraphId }, vehicle, name, email]) =>
        this.techRecordHttpService.generateLetter$(vehicle as TechRecordType<'get'>, letterType, paragraphId, { name, email }).pipe(
          map(() => generateLetterSuccess()),
          catchError((error) => of(generateLetterFailure({ error: this.getTechRecordErrorMessage(error, 'generateLetter') }))),
        )),
    ));

  unarchiveTechRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unarchiveTechRecord),
      switchMap(({
        systemNumber, createdTimestamp, reasonForUnarchiving, status,
      }) =>
        this.techRecordHttpService.unarchiveTechnicalRecord$(systemNumber, createdTimestamp, reasonForUnarchiving, status).pipe(
          map((vehicleTechRecord) => unarchiveTechRecordSuccess({ vehicleTechRecord })),
          catchError((error) => of(unarchiveTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'unarchiveTechRecord') }))),
        )),
    ));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTechRecordErrorMessage(error: any, type: string, search?: string): string {
    if (typeof error !== 'object') {
      return error;
    } if (error.status === 404) {
      return this.apiErrors[`${type}_404`];
    }
    return `${this.apiErrors[`${type}_400`]} ${search ?? JSON.stringify(error.error)}`;

  }

  private apiErrors: Record<string, string> = {
    getTechnicalRecords_400: 'There was a problem getting the Tech Record by',
    getTechnicalRecords_404: 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
    createVehicleRecord_400: 'Unable to create a new vehicle record',
    // createProvisionalTechRecord_400: 'Unable to create a new provisional record',
    updateTechnicalRecord_400: 'Unable to update technical record',
    archiveTechRecord_400: 'Unable to archive technical record',
    promoteTechRecord_400: 'Unable to promote technical record',
    unarchiveTechRecord_400: 'Unable to unarchive technical record',
  };
}
