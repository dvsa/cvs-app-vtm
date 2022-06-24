import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getByVIN, getByPartialVIN, selectVehicleTechnicalRecordsByVin, vehicleTechRecords } from '@store/technical-records';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum SEARCH_TYPES {
  VIN = 'vin',
  PARTIAL_VIN = 'partialVin'
}

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  constructor(private store: Store, private http: HttpClient) {}

  getByVIN(vin: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(vin, SEARCH_TYPES.VIN);
  }

  getByPartialVIN(partialVin: string): Observable<VehicleTechRecordModel[]> {
    return this.getVehicleTechRecordModels(partialVin, SEARCH_TYPES.PARTIAL_VIN);
  }

  private getVehicleTechRecordModels(identifier: string, type: SEARCH_TYPES) {
    const queryStr = `${identifier}/tech-records?status=all&metadata=true&searchCriteria=${type}`;
    const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`;

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' });
  }

  get vehicleTechRecords$() {
    return this.store.pipe(select(vehicleTechRecords));
  }

  get selectedVehicleTechRecord$() {
    return this.store.pipe(select(selectVehicleTechnicalRecordsByVin));
  }

  searchBy(criteria: { type: SEARCH_TYPES; searchTerm: string }) {
    const { type, searchTerm } = criteria;

    switch (type) {
      case SEARCH_TYPES.VIN:
        this.store.dispatch(getByVIN({ [type]: searchTerm }));
        break;
      case SEARCH_TYPES.PARTIAL_VIN:
        this.store.dispatch(getByPartialVIN({ [type]: searchTerm }));
        break;
    }
  }

  /**
   * A function to get the correct tech record to create the summary display which uses time first then status code
   * @param vehicleRecord This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  viewableTechRecord$(vehicleRecord: VehicleTechRecordModel, destroy$: Subject<any>): Observable<TechRecordModel | undefined> {
    return this.store
      .pipe(
        select(selectRouteNestedParams),
        map(({ techCreatedAt }) => {
          const viewableTechRecord = vehicleRecord.techRecord.find(techRecord => new Date(techRecord.createdAt).getTime() == techCreatedAt);
          return viewableTechRecord ?? this.filterTechRecordByStatusCode(vehicleRecord)
        }
      ));
  }

  /**
   * A function to filter the correct tech record, this has a hierarchy which is PROVISIONAL -> CURRENT -> ARCHIVED.
   * @param record This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  private filterTechRecordByStatusCode(record: VehicleTechRecordModel): TechRecordModel | undefined {
    return record.techRecord.find(record => record.statusCode === StatusCodes.PROVISIONAL)
      ?? record.techRecord.find(record => record.statusCode === StatusCodes.CURRENT)
      ?? record.techRecord.find(record => record.statusCode === StatusCodes.ARCHIVED);
  }
}
