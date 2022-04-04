import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { VehicleTechRecordModel } from '../models/vehicle-tech-record.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  constructor(private store: Store, private http: HttpClient) { }

  getByVIN(vin: string): Observable<VehicleTechRecordModel[]> {
    const queryStr = `${vin}/tech-records?status=all&metadata=true&searchCriteria=vin`;
    const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`;

    return this.http
      .get<{ items: VehicleTechRecordModel[] }>(url, { responseType: 'json' })
      .pipe(map((techRecords) => techRecords.items || []));
  }
}
