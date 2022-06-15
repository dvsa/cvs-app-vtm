import { HttpClient, HttpParams } from '@angular/common/http';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { GetTestResultsService, TestResultPutBody, UpdateTestResultsService } from '@api/test-results';
import { TestResultModel } from '@models/test-result.model';
import { select, Store } from '@ngrx/store';
import {
  fetchTestResults,
  fetchTestResultsBySystemId,
  selectAllTestResults,
  selectAmendedDefectData,
  selectDefectData,
  selectedAmendedTestResultState,
  selectedTestResultState,
  TestResultsState
} from '@store/test-records';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestRecordsService {
  constructor(
    private http: HttpClient,
    private store: Store<TestResultsState>,
    private updateTestResultsService: UpdateTestResultsService,
    private getTestResultService: GetTestResultsService
  ) {}

  fetchTestResultbySystemId(
    systemNumber: string,
    queryparams: {
      status?: string;
      fromDateTime?: Date;
      toDateTime?: Date;
      testResultId?: string;
      version?: string;
    } = {}
  ): Observable<Array<TestResultModel>> {
    const { status, fromDateTime, toDateTime, testResultId, version } = queryparams;
    return this.getTestResultService.testResultsSystemNumberGet(systemNumber, status, fromDateTime, toDateTime, testResultId, version) as Observable<
      Array<TestResultModel>
    >;
    // if (!systemId) {
    //   return throwError(() => new Error('systemId is required'));
    // }

    // let params = {};
    // if (queryparams && Object.keys(queryparams).length > 0) {
    //   params = new HttpParams({ fromObject: queryparams });
    // }

    // const url = `${environment.VTM_API_URI}/test-results/${systemId}`;

    // return this.http.get<Array<TestResultModel>>(url, { params });
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

  get amendedTestResult$() {
    return this.store.pipe(select(selectedAmendedTestResultState));
  }

  get amendedDefectData$() {
    return this.store.pipe(select(selectAmendedDefectData));
  }

  saveTestResult(
    user: { username: string; id?: string },
    body: TestResultModel,
    testResultId: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<TestResultModel[]> {
    const { username, id } = user;

    return this.updateTestResultsService.testResultsTestResultIdPut(
      { msUserDetails: { msOid: id, msUser: username }, testResult: body as any } as TestResultPutBody,
      testResultId,
      observe,
      reportProgress
    ) as unknown as Observable<TestResultModel[]>;
  }
}
