import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';
import { environment } from '../../../../src/environments/environment';
import *  as TestRecordServiceState from '../../store/test-records/test-record-service.reducer';
import *  as TestRecordServiceActions from '../../store/test-records/test-record-service.actions';

@Injectable({ providedIn: 'root' })
export class TestRecordService {
  constructor(private store: Store, private http: HttpClient) { }

  getBySystemId(systemId: string): Observable<TestResultModel[]> {
    const url = `${environment.VTM_TEST_URI}/test-results/${systemId}`;

    return this.http
      .get<TestResultModel[]>(url, { responseType: 'json' })
      .pipe(map((testRecords) => testRecords || []));
  }

 
  getTestRecords(id: string): Observable<TestResultModel[]> {
    return this.store.pipe(select(TestRecordServiceState.testRecords)).pipe(map((value) => value.testRecords || []));
  }

}
