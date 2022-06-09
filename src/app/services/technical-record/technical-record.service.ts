import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { getByVIN, getByPartialVIN, selectVehicleTechnicalRecordsByVin, vehicleTechRecords } from '@store/technical-records';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum SEARCH_TYPES {
  VIN = 'vin',
  PARTIAL_VIN = 'partialVin'
}

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  constructor(private store: Store, private http: HttpClient) {}

  getByVIN(vin: string): Observable<VehicleTechRecordModel[]> {
    const queryStr = `${vin}/tech-records?status=all&metadata=true&searchCriteria=vin`;
    const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`;

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' });
  }

  getByPartialVIN(partialVin: string): Observable<VehicleTechRecordModel[]> {
    const queryStr = `${partialVin}/tech-records?status=all&metadata=true&searchCriteria=partialVin`
    const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' })
  }

  get vehicleTechRecords$() {
    return this.store.pipe(select(vehicleTechRecords));
  }

  get selectedVehicleTechRecord$() {
    return this.store.pipe(select(selectVehicleTechnicalRecordsByVin));
  }

  searchBy(criteria: { type: SEARCH_TYPES; searchTerm: string }) {
    const { type, searchTerm } = criteria;

    switch(type) {
      case SEARCH_TYPES.VIN:
        this.store.dispatch(getByVIN({ [type]: searchTerm }));
        break;
      case SEARCH_TYPES.PARTIAL_VIN:
        this.store.dispatch(getByPartialVIN({ [type]: searchTerm }));
        break;
    }
  }
}
