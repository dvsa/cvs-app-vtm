import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';
import { environment } from 'src/environments/environment';
import *  as TestRecordServiceState from './test-record-service.reducer';
import *  as TestRecordServiceActions from './test-record-service.actions';

@Injectable({ providedIn: 'root' })
export class TestRecordService {
  constructor(private store: Store, private http: HttpClient) { }

  getBySystemId(systemId: string): Observable<TestResultModel[]> {
    console.log("service");
    //const queryStr = `${vin}/tech-records?status=all&metadata=true&searchCriteria=vin`;
    //const url = `${environment.VTM_API_URI}/vehicles/${queryStr}`;
    //TODO
    const url = `http://localhost:3006/test-results/11000001`;

    return this.http
      .get<TestResultModel[]>(url, { responseType: 'json' })
      .pipe(map((testRecords) => testRecords || []));
  }

 
  getTestRecords(id: string): Observable<TestResultModel[]> {
    this.store.dispatch(TestRecordServiceActions.getBySystemId({'systemId': id}));

    return this.store.pipe(select(TestRecordServiceState.testRecords)).pipe(map((value) => value.testRecords || []));
  }

}
