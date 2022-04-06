import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import { fetchTestResultBySystemId, fetchTestResults, selectedTestResultState, TestResultsState } from '@store/test-results';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService {
  constructor(private http: HttpClient, private store: Store<State>) {}

  fetchTestResultbyServiceId(serviceId: string, queryparams?: { testResultId?: string }): Observable<TestResultModel> {
    if (!serviceId) {
      return throwError(() => new Error('serviceId is requuired'));
    }

    let params = {};
    if (queryparams && Object.keys(queryparams).length > 0) {
      params = new HttpParams({ fromObject: queryparams });
    }

    const url = `${environment.VTM_API_URI}/test-results/${serviceId}`;

    return this.http.get<TestResultModel>(url, { params });
  }

  loadTestResults(): void {
    this.store.dispatch(fetchTestResults());
  }

  loadTestResultBySystemId(systemId: string): void {
    this.store.dispatch(fetchTestResultBySystemId({ systemId }));
  }

  get testResult$() {
    return this.store.pipe(select(selectedTestResultState));
  }
}
