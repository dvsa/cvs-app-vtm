import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { select, Store } from '@ngrx/store';
import { fetchTestResults, fetchTestResultsBySystemId, selectAllTestResults, selectDefectData, selectedTestResultState, selectVehicleType, TestResultsState } from '@store/test-records';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestRecordsService {
  constructor(private http: HttpClient, private store: Store<TestResultsState>) {}

  fetchTestResultbySystemId(systemId: string, queryparams?: { testResultId?: string }): Observable<Array<TestResultModel>> {
    if (!systemId) {
      return throwError(() => new Error('systemId is required'));
    }

    let params = {};
    if (queryparams && Object.keys(queryparams).length > 0) {
      params = new HttpParams({ fromObject: queryparams });
    }

    const url = `${environment.VTM_API_URI}/test-results/${systemId}`;

    return this.http.get<Array<TestResultModel>>(url, { params });
  }

  loadTestResults(): void {
    this.store.dispatch(fetchTestResults());
  }

  loadTestResultBySystemId(systemId: string): void {
    this.store.dispatch(fetchTestResultsBySystemId({ systemId }));
  }

  get testResult$() {
    return this.store.pipe(select(selectedTestResultState));
  }

  get testRecords$() {
    return this.store.pipe(select(selectAllTestResults));
  }

  get defectData$() {
    return this.store.pipe(select(selectDefectData));
  }

  get vehicleType$() {
    return this.store.pipe(select(selectVehicleType));
  }
}
