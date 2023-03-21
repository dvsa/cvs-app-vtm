import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormControl } from '@forms/services/dynamic-form.types';
import {
  EuVehicleCategories,
  postNewVehicleModel,
  PutVehicleTechRecordModel,
  StatusCodes,
  TechRecordModel,
  VehicleTechRecordModel,
  VehicleTypes
} from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import {
  createVehicle,
  editableTechRecord,
  editableVehicleTechRecord,
  getByAll,
  getByPartialVin,
  getByTrailerId,
  getByVin,
  getByVrm,
  selectVehicleTechnicalRecordsBySystemNumber,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  vehicleTechRecords
} from '@store/technical-records';
import { clearBatch, setApplicationId, setGenerateNumberFlag, upsertVehicleBatch } from '@store/technical-records/actions/batch-create.actions';
import {
  selectBatchCount,
  selectAllBatch,
  selectIsBatch,
  selectGenerateNumber,
  selectCreatedBatch,
  selectCreatedBatchCount,
  selectApplicationId
} from '@store/technical-records/selectors/batch-create.selectors';
import { cloneDeep } from 'lodash';
import { catchError, Observable, of, map, switchMap, take, throwError, debounceTime, filter } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum SEARCH_TYPES {
  VIN = 'vin',
  PARTIAL_VIN = 'partialVin',
  VRM = 'vrm',
  TRAILER_ID = 'trailerId',
  SYSTEM_NUMBER = 'systemNumber',
  ALL = 'all'
}

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  constructor(private http: HttpClient, private router: Router, private store: Store) {}

  get vehicleTechRecords$(): Observable<VehicleTechRecordModel[]> {
    return this.store.pipe(select(vehicleTechRecords));
  }

  get editableTechRecord$(): Observable<TechRecordModel | undefined> {
    return this.store.pipe(select(editableTechRecord));
  }

  get editableVehicleTechRecord$(): Observable<VehicleTechRecordModel | undefined> {
    return this.store.pipe(select(editableVehicleTechRecord));
  }

  get selectedVehicleTechRecord$(): Observable<VehicleTechRecordModel | undefined> {
    return this.store.pipe(select(selectVehicleTechnicalRecordsBySystemNumber));
  }

  get techRecord$(): Observable<TechRecordModel | undefined> {
    return this.selectedVehicleTechRecord$.pipe(switchMap(vehicle => (vehicle ? this.viewableTechRecord$(vehicle) : of(undefined))));
  }

  getVehicleTypeWithSmallTrl(techRecord?: TechRecordModel): VehicleTypes | undefined {
    return techRecord?.vehicleType === VehicleTypes.TRL && techRecord.euVehicleCategory === EuVehicleCategories.O1
      ? VehicleTypes.SMALL_TRL
      : techRecord?.vehicleType;
  }

  getByVin(vin: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(vin, SEARCH_TYPES.VIN);
  }

  getByPartialVin(partialVin: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(partialVin, SEARCH_TYPES.PARTIAL_VIN);
  }

  getByVrm(vrm: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(vrm, SEARCH_TYPES.VRM);
  }

  getByTrailerId(id: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(id, SEARCH_TYPES.TRAILER_ID);
  }

  getBySystemNumber(systemNumber: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(systemNumber, SEARCH_TYPES.SYSTEM_NUMBER);
  }

  getByAll(term: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(term, SEARCH_TYPES.ALL);
  }

  private getVehicleTechRecordModels(id: string, type: SEARCH_TYPES): Observable<VehicleTechRecordModel[]> {
    const queryStr = `${id}/tech-records?status=all&metadata=true&searchCriteria=${type}`;
    const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`;

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' });
  }

  createVehicleRecord(newVehicleRecord: VehicleTechRecordModel, user: { id?: string; name: string }): Observable<postNewVehicleModel> {
    const recordCopy = cloneDeep(newVehicleRecord);

    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      vin: recordCopy.vin,
      primaryVrm: recordCopy.vrms ? recordCopy.vrms[0].vrm : null,
      trailerId: recordCopy.trailerId ?? null,
      techRecord: recordCopy.techRecord
    };

    return this.http.post<postNewVehicleModel>(`${environment.VTM_API_URI}/vehicles`, body);
  }

  createProvisionalTechRecord(
    systemNumber: string,
    techRecord: TechRecordModel,
    user: { id?: string; name: string }
  ): Observable<VehicleTechRecordModel> {
    // THIS ALLOWS US TO CREATE PROVISIONAL FROM THE CURRENT TECH RECORD
    const recordCopy = cloneDeep(techRecord);
    recordCopy.statusCode = StatusCodes.PROVISIONAL;
    delete recordCopy.updateType;

    const url = `${environment.VTM_API_URI}/vehicles/add-provisional/${systemNumber}`;

    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: [recordCopy]
    };

    return this.http.post<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  updateTechRecords(
    systemNumber: string,
    vehicleTechRecord: VehicleTechRecordModel,
    user: { id?: string; name: string },
    recordToArchiveStatus?: StatusCodes,
    newStatus?: StatusCodes
  ): Observable<VehicleTechRecordModel> {
    const newVehicleTechRecord = cloneDeep(vehicleTechRecord);
    const newTechRecord = newVehicleTechRecord.techRecord[0];
    newTechRecord.statusCode = newStatus ?? newTechRecord.statusCode;
    delete newTechRecord.updateType;

    const url = `${environment.VTM_API_URI}/vehicles/${systemNumber}` + `${recordToArchiveStatus ? '?oldStatusCode=' + recordToArchiveStatus : ''}`;

    const body: PutVehicleTechRecordModel & { msUserDetails: { msOid: string | undefined; msUser: string } } = {
      ...this.formatVrmsForUpdatePayload(vehicleTechRecord),
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: [newTechRecord]
    };

    return this.http.put<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  archiveTechnicalRecord(
    systemNumber: string,
    techRecord: TechRecordModel,
    reason: string,
    user: { id?: string; name: string }
  ): Observable<VehicleTechRecordModel> {
    const url = `${environment.VTM_API_URI}/vehicles/archive/${systemNumber}`;

    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: [techRecord],
      reasonForArchiving: reason
    };

    return this.http.put<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  isUnique(valueToCheck: string, searchType: SEARCH_TYPES): Observable<boolean> {
    const isUnique = this.getVehicleTechRecordModels(valueToCheck, searchType).pipe(
      map(vehicleTechRecord => {
        const allTechRecords = vehicleTechRecord.flatMap(record => record.techRecord);
        if (allTechRecords.every(record => record.statusCode === StatusCodes.ARCHIVED)) {
          return true;
        }

        if (searchType === SEARCH_TYPES.VRM) {
          const allVrms = vehicleTechRecord.flatMap(record => record.vrms);
          return !allVrms.some(vrm => vrm.isPrimary && vrm.vrm == valueToCheck);
        }

        return false;
      }),
      catchError((error: HttpErrorResponse) => {
        return (error.status == 404 && of(true)) || throwError(() => error);
      })
    );
    return isUnique;
  }

  /**
   * A function to get the correct tech record to create the summary display which uses time first then status code
   * @param vehicleRecord This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  viewableTechRecord$(vehicleRecord: VehicleTechRecordModel): Observable<TechRecordModel | undefined> {
    return this.store.pipe(
      select(selectRouteNestedParams),
      map(params => {
        const lastTwoUrlParts = this.router.url.split('/').slice(-2);

        if (lastTwoUrlParts.includes('provisional')) {
          return vehicleRecord.techRecord.find(record => record.statusCode === StatusCodes.PROVISIONAL);
        }

        const createdAt = params['techCreatedAt'];

        if (createdAt) {
          return vehicleRecord.techRecord.find(
            techRecord => new Date(techRecord.createdAt).getTime() == createdAt && techRecord.statusCode === StatusCodes.ARCHIVED
          );
        }

        return this.filterTechRecordByStatusCode(vehicleRecord);
      })
    );
  }

  /**
   * A function which takes either a TechRecordModel or a VehicleTechRecordModel, maps the missing vehicle record information if passed
   * a TechRecordModel and dispatches the action to update the editing tech record.
   * @param record - TechRecordModel or VehicleTechRecordModel
   * @param resetVehicleAttributes [resetVehicleAttributes=false] - Used to overwrite the attributes inside of the properties inside
   * the VehicleTechRecordModel to the un-edited information present in state for that vehicle. Only used if passed a TechRecordModel.
   * @returns void
   */
  updateEditingTechRecord(record: TechRecordModel | VehicleTechRecordModel, resetVehicleAttributes = false): void {
    const isVehicleRecord = (rec: TechRecordModel | VehicleTechRecordModel): rec is VehicleTechRecordModel =>
      rec.hasOwnProperty('vin') && rec.hasOwnProperty('techRecord');

    const vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined> = isVehicleRecord(record)
      ? of(record)
      : this.store.pipe(
          select(editableVehicleTechRecord),
          switchMap(vehicleRecord => (vehicleRecord && !resetVehicleAttributes ? of(vehicleRecord) : this.selectedVehicleTechRecord$)),
          map(vehicleRecord => vehicleRecord && { ...vehicleRecord, techRecord: [record] })
        );

    vehicleTechRecord$.pipe(take(1)).subscribe(vehicleRecord => {
      if (vehicleRecord) {
        this.store.dispatch(updateEditingTechRecord({ vehicleTechRecord: vehicleRecord }));
      }
    });
  }

  initialBatchTechRecord(vehicleRecord: VehicleTechRecordModel) {
    this.store.dispatch(updateEditingTechRecord({ vehicleTechRecord: vehicleRecord }));
  }

  /**
   * A function to filter the correct tech record, this has a hierarchy which is CURRENT -> PROVISIONAL -> ARCHIVED.
   * @param record This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  private filterTechRecordByStatusCode(record: VehicleTechRecordModel): TechRecordModel | undefined {
    return (
      record.techRecord.find(record => record.statusCode === StatusCodes.CURRENT) ??
      record.techRecord.find(record => record.statusCode === StatusCodes.PROVISIONAL) ??
      record.techRecord.find(record => record.statusCode === StatusCodes.ARCHIVED)
    );
  }

  searchBy(type: SEARCH_TYPES, term: string): void {
    switch (type) {
      case SEARCH_TYPES.VIN:
        this.store.dispatch(getByVin({ [type]: term }));
        break;
      case SEARCH_TYPES.PARTIAL_VIN:
        this.store.dispatch(getByPartialVin({ [type]: term }));
        break;
      case SEARCH_TYPES.VRM:
        this.store.dispatch(getByVrm({ [type]: term }));
        break;
      case SEARCH_TYPES.TRAILER_ID:
        this.store.dispatch(getByTrailerId({ [type]: term }));
        break;
      case SEARCH_TYPES.ALL:
        this.store.dispatch(getByAll({ [type]: term }));
        break;
    }
  }

  generateEditingVehicleTechnicalRecordFromVehicleType(vehicleType: VehicleTypes): void {
    this.store.dispatch(createVehicle({ vehicleType: vehicleType }));
  }

  clearReasonForCreation(vehicleTechRecord?: VehicleTechRecordModel): void {
    this.editableVehicleTechRecord$
      .pipe(
        map(data => cloneDeep(data ?? vehicleTechRecord)),
        take(1)
      )
      .subscribe(data => {
        if (data) {
          data.techRecord[0].reasonForCreation = '';
          this.updateEditingTechRecord(data);
        }
      });
  }

  generatePlate(
    vehicleRecord: VehicleTechRecordModel,
    techRecord: TechRecordModel,
    reason: string,
    user: { id?: string; name?: string; email?: string }
  ) {
    const url = `${environment.VTM_API_URI}/vehicles/documents/plate`;

    const body = {
      vin: vehicleRecord.vin,
      primaryVrm: techRecord.vehicleType !== 'trl' ? vehicleRecord.vrms.find(x => x.isPrimary)!.vrm : undefined,
      systemNumber: vehicleRecord.systemNumber,
      trailerId: techRecord.vehicleType === 'trl' ? vehicleRecord.trailerId : undefined,
      msUserDetails: { msOid: user.id, msUser: user.name },
      techRecord: vehicleRecord.techRecord,
      reasonForCreation: reason,
      vtmUsername: user.name,
      recipientEmailAddress: techRecord?.applicantDetails?.emailAddress ? techRecord.applicantDetails?.emailAddress : user.email
    };

    return this.http.post(url, body, { responseType: 'json' });
  }

  generateLetter(
    vehicleRecord: VehicleTechRecordModel,
    techRecord: TechRecordModel,
    letterType: string,
    paragraphId: number,
    user: { id?: string; name?: string; email?: string }
  ) {
    const url = `${environment.VTM_API_URI}/vehicles/documents/letter`;

    const body = {
      vin: vehicleRecord.vin,
      primaryVrm: undefined,
      systemNumber: vehicleRecord.systemNumber,
      trailerId: vehicleRecord.trailerId,
      techRecord: vehicleRecord.techRecord,
      vtmUsername: user.name,
      letterType: letterType,
      paragraphId: paragraphId,
      recipientEmailAddress: techRecord?.applicantDetails?.emailAddress ? techRecord.applicantDetails?.emailAddress : user.email
    };

    return this.http.post<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  private formatVrmsForUpdatePayload(vehicleTechRecord: VehicleTechRecordModel): PutVehicleTechRecordModel {
    const secondaryVrms: string[] = [];
    const putVehicleTechRecordModel: PutVehicleTechRecordModel = { ...vehicleTechRecord, secondaryVrms };
    vehicleTechRecord.vrms.forEach(vrm => {
      vrm.isPrimary ? (putVehicleTechRecordModel.primaryVrm = vrm.vrm) : putVehicleTechRecordModel.secondaryVrms!.push(vrm.vrm);
    });
    delete (putVehicleTechRecordModel as any).vrms;
    return putVehicleTechRecordModel;
  }

  clearEditingTechRecord() {
    this.store.dispatch(updateEditingTechRecordCancel());
  }

  updateVin(newVin: string, systemNumber: string, user: { id?: string; name?: string }) {
    const url = `${environment.VTM_API_URI}/vehicles/update-vin/${systemNumber}`;
    const body = {
      msUserDetails: { msOid: user.id, msUser: user.name },
      newVin
    };
    return this.http.put(url, body, { responseType: 'json' });
  }

  validateVin(originalVin?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        filter((value: string) => !!value),
        debounceTime(1000),
        take(1),
        switchMap(value => {
          return this.isUnique(value, SEARCH_TYPES.VIN).pipe(
            map(result => {
              if (control.value === originalVin) {
                return { validateVin: { message: 'You must provide a new VIN' } };
              } else {
                return result
                  ? null
                  : { validateVin: { message: 'This VIN already exists, if you continue it will be associated with two vehicles' } };
              }
            }),
            catchError(error => of(null))
          );
        })
      );
    };
  }

  validateVinAndTrailerId(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const trailerId = control.parent?.get('trailerId') as CustomFormControl;
      const vin = control.parent?.get('vin') as CustomFormControl;
      if (trailerId && vin) {
        if (trailerId.valid) {
          return of(control.value).pipe(
            filter((value: string) => !!value),
            debounceTime(1000),
            switchMap(value => {
              return this.getByVin(vin.value).pipe(
                map(result => {
                  if (result) {
                    const filteredResults = result.filter(vehicleTechRecord => vehicleTechRecord.trailerId === trailerId.value);
                    if (filteredResults.length > 1) {
                      return { validateVinAndTrailerId: { message: 'More than one vehicle has this VIN and Trailer ID' } };
                    }
                    if (!filteredResults.length) {
                      return { validateVinAndTrailerId: { message: 'No vehicle has this VIN and Trailer ID' } };
                    }
                    if (filteredResults[0].techRecord.filter(techRecord => techRecord.statusCode === StatusCodes.CURRENT).length > 0) {
                      return { validateVinAndTrailerId: { message: 'This record cannot be updated as it has a Current tech record' } };
                    }
                    return null;
                  } else {
                    return { validateVinAndTrailerId: { message: 'Could not find a record with matching VIN' } };
                  }
                }),
                catchError(error => of({ validateVinAndTrailerId: { message: 'Could not find a record with matching VIN' } }))
              );
            })
          );
        } else {
          console.log('Piss');
          return of({ validateVinAndTrailerId: { message: 'VIN and Trailer ID are not in the required format' } });
        }
      } else {
        return of({ validateVinAndTrailerId: { message: 'VIN and Trailer ID are required' } });
      }
    };
  }

  upsertVehicleBatch(vehicles: Array<{ vin: string; trailerId?: string }>) {
    this.store.dispatch(upsertVehicleBatch({ vehicles }));
  }

  get batchVehicles$() {
    return this.store.pipe(select(selectAllBatch));
  }

  get batchVehiclesCreated$() {
    return this.store.pipe(select(selectCreatedBatch));
  }

  get isBatchCreate$() {
    return this.store.pipe(select(selectIsBatch));
  }

  get batchCount$() {
    return this.store.pipe(select(selectBatchCount));
  }

  get batchCreatedCount$() {
    return this.store.pipe(select(selectCreatedBatchCount));
  }

  get applicationId$() {
    return this.store.pipe(select(selectApplicationId));
  }

  get generateNumber$() {
    return this.store.pipe(select(selectGenerateNumber));
  }

  setApplicationId(applicationId: string) {
    this.store.dispatch(setApplicationId({ applicationId }));
  }
  setGenerateNumberFlag(generateNumber: boolean) {
    this.store.dispatch(setGenerateNumberFlag({ generateNumber }));
  }

  clearBatch() {
    this.store.dispatch(clearBatch());
  }
}
