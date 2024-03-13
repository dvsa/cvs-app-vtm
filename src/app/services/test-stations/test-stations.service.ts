import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import { TestStation } from '@models/test-stations/test-station.model';
import { CacheBucket, withCache } from '@ngneat/cashew';
import { Store } from '@ngrx/store';
import { TestStationsState, setTestStationsLoading, testStations } from '@store/test-stations';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TestStationsService {
  private url = `${environment.VTM_API_URI}/test-stations/`;
  private cacheBucket = new CacheBucket();

  constructor(private http: HttpClient, private store: Store<TestStationsState>) {}

  fetchTestStations(): Observable<Array<TestStation>> {
    if (!this.cacheBucket.has(this.url)) {
      this.store.dispatch(setTestStationsLoading({ loading: true }));
    }

    return this.http.get<Array<TestStation>>(this.url, {
      responseType: 'json',
      context: withCache({
        mode: 'stateManagement',
        bucket: this.cacheBucket,
        key: this.url,
      }),
    });
  }

  fetchTestStation(id: string): Observable<TestStation> {
    const url = this.url + id;

    if (!this.cacheBucket.has(url)) {
      this.store.dispatch(setTestStationsLoading({ loading: true }));
    }

    return this.http.get<TestStation>(url, {
      responseType: 'json',
      context: withCache({
        mode: 'stateManagement',
        bucket: this.cacheBucket,
        key: this.url,
      }),
    });
  }

  getTestStationsOptions(): Observable<MultiOptions> {
    return this.store.select(testStations).pipe(
      map((allTestStations) =>
        allTestStations
          .sort((a, b) => a.testStationName.localeCompare(b.testStationName))
          .map((testStation) => {
            const label = `${testStation.testStationName} - ${testStation.testStationPNumber}`;
            return { value: testStation.testStationPNumber, label };
          })),
    );
  }
}
