import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
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
  vehicleTechRecords
} from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { catchError, Observable, of, map, switchMap, take, throwError } from 'rxjs';
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
    return this.selectedVehicleTechRecord$.pipe(switchMap(techRecord => (techRecord ? this.viewableTechRecord$(techRecord) : of(undefined))));
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

  private formatVrmsForUpdatePayload(vehicleTechRecord: VehicleTechRecordModel): PutVehicleTechRecordModel {
    const secondaryVrms: string[] = [];
    const putVehicleTechRecordModel: PutVehicleTechRecordModel = { ...vehicleTechRecord, secondaryVrms };
    vehicleTechRecord.vrms.forEach(vrm => {
      vrm.isPrimary ? (putVehicleTechRecordModel.primaryVrm = vrm.vrm) : putVehicleTechRecordModel.secondaryVrms!.push(vrm.vrm);
    });
    delete (putVehicleTechRecordModel as any).vrms;
    return putVehicleTechRecordModel;
  }
}
