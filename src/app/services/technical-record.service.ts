import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { VehicleTechRecordModel } from '../models/vehicle-tech-record.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnicalRecordService {

  constructor(private http: HttpClient) { }

  getByVIN(vin: string): Observable<VehicleTechRecordModel[]> {
    const queryStr = `${vin}/tech-records?status=all&metadata=true&searchCriteria=vin`;
    const url = `${environment.apiUrl}/vehicles/${queryStr}`;

    return this.http
      .get<VehicleTechRecordModel[]>(
        url,
        { responseType: 'json' }
      )
      .pipe(
        retry(3), // retry a failed request up to 3 times
        // catchError(this.handleError) // then handle the error
      );

      // Original implementation from archive/../technical-record-search/technical-record.service.ts:
      // )
      // .pipe(
      //   delayedRetry(),
      //   shareReplay(),
      //   finalize(() => this._store.dispatch(new LoadingFalse()))
      // );
  }
}
