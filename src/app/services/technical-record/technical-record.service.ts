import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import {
  getByAll,
  getByPartialVin,
  getBySystemNumber,
  getByTrailerId,
  getByVin,
  getByVrm,
  selectVehicleTechnicalRecordsBySystemNumber,
  vehicleTechRecords
} from '@store/technical-records';
import { clone, cloneDeep } from 'lodash';
import { map, Observable, of, switchMap } from 'rxjs';
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
  constructor(private store: Store, private http: HttpClient) {}

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

  private getVehicleTechRecordModels(id: string, type: SEARCH_TYPES) {
    const queryStr = `${id}/tech-records?status=all&metadata=true&searchCriteria=${type}`;
    const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`;

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' });
  }

  putUpdateTechRecords(systemNumber: string, techRecord: TechRecordModel, user: { username: string; id?: string }, oldStatusCode?: StatusCodes) {
    const { username, id } = user;
    const url = oldStatusCode ? `${environment.VTM_API_URI}/vehicles/${systemNumber}?oldStatusCode=${oldStatusCode}`: `${environment.VTM_API_URI}/vehicles/${systemNumber}`;
    const body = {
      msUserDetails: { msOid: id, msUser: username },
      techRecord: [cloneDeep(techRecord)]
    };
    
    // SCENARIO WHERE TECH RECORD TO BE AMENDED IS CURRENT TECH RECORD, THE BELOW MEANS WE CREATE A PROVISIONAL RECORD NOT A CURRENT
    if (techRecord.statusCode === StatusCodes.CURRENT) {
      body.techRecord[0].statusCode = StatusCodes.PROVISIONAL
    }

    if (techRecord.updateType) {
      delete body.techRecord[0].updateType
    }
    
    return this.http.put<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  postProvisionalTechRecord(systemNumber: string, techRecord: TechRecordModel, user: { username: string, id?: string }) {
    // THIS ALLOWS US TO CREATE PROVISIONAL FROM THE CURRENT TECH RECORD
    const recordCopy = cloneDeep(techRecord);
    recordCopy.statusCode = StatusCodes.PROVISIONAL

    const { username, id } = user;
    const url = `${environment.VTM_API_URI}/vehicles/add-provisional/${systemNumber}`;
    const body = {
      msUserDetails: { msOid: id, msUser: username },
      techRecord: [recordCopy]
    };

    return this.http.post<VehicleTechRecordModel>(url, body, { responseType: 'json' });
  }

  get vehicleTechRecords$() {
    return this.store.pipe(select(vehicleTechRecords));
  }

  get selectedVehicleTechRecord$() {
    return this.store.pipe(select(selectVehicleTechnicalRecordsBySystemNumber));
  }

  searchBy(type: SEARCH_TYPES, term: string) {
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
      case SEARCH_TYPES.SYSTEM_NUMBER:
        this.store.dispatch(getBySystemNumber({ [type]: term }));
        break;
      case SEARCH_TYPES.ALL:
        this.store.dispatch(getByAll({ [type]: term }));
        break;
    }
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
        const createdAt = params['techCreatedAt'];
        return createdAt
          ? vehicleRecord.techRecord.find(techRecord => new Date(techRecord.createdAt).getTime() == createdAt)
          : this.filterTechRecordByStatusCode(vehicleRecord);
      })
    );
  }

  /**
   * A function to filter the correct tech record, this has a hierarchy which is PROVISIONAL -> CURRENT -> ARCHIVED.
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

  get techRecord$(): Observable<TechRecordModel | undefined> {
    return this.selectedVehicleTechRecord$.pipe(switchMap(techRecord => (techRecord ? this.viewableTechRecord$(techRecord) : of(undefined))));
  }
}
