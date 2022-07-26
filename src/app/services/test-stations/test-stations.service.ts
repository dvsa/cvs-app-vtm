import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestStation } from '@models/test-station.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TestStationsService {
  private url = `${environment.VTM_API_URI}/test-stations/`;

  constructor(private http: HttpClient) {}

  fetchTestStations(): Observable<Array<TestStation>> {
    return this.http.get<Array<TestStation>>(this.url, { responseType: 'json' });
  }

  fetchTestStation(id: string): Observable<TestStation> {
    return this.http.get<TestStation>(this.url + id, { responseType: 'json' });
  }
}
