import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import { TestStation } from '@models/test-station.model';
import { Store } from '@ngrx/store';
import { testStations, TestStationsState } from '@store/test-stations';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TestStationsService {
  private url = `${environment.VTM_API_URI}/test-stations/`;

  constructor(private http: HttpClient, private store: Store<TestStationsState>) {}

  fetchTestStations(): Observable<Array<TestStation>> {
    return this.http.get<Array<TestStation>>(this.url, { responseType: 'json' });
  }

  fetchTestStation(id: string): Observable<TestStation> {
    return this.http.get<TestStation>(this.url + id, { responseType: 'json' });
  }

  getTestStationsOptions(propertyName: string): Observable<MultiOptions> {
    return this.store.select(testStations).pipe(
      map(testStations => testStations.map(testStation => {
        const value = String(testStation[propertyName as keyof typeof testStation]);
        return { value, label: value };
      }))
    );
  }
}
