import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { getByVIN, selectVehicleTechnicalRecordByVin, vehicleTechRecords } from '@store/technical-records';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  constructor(private store: Store, private http: HttpClient) {}

  getByVIN(vin: string): Observable<VehicleTechRecordModel[]> {
    const queryStr = `${vin}/tech-records?status=all&metadata=true&searchCriteria=vin`;
    const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`;

    return this.http.get<VehicleTechRecordModel[]>(url, { responseType: 'json' });
  }

  get vehicleTechRecords$() {
    return this.store.pipe(select(vehicleTechRecords));
  }

  get selectedVehicleTechRecord$() {
    return this.store.pipe(select(selectVehicleTechnicalRecordByVin));
  }

  searchBy(criteria: { type: 'vin'; searchTerm: string }) {
    const { type, searchTerm } = criteria;
    this.store.dispatch(getByVIN({ [type]: searchTerm }));
  }
}
