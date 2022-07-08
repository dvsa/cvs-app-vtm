import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetTestResultsService, TestResultPutBody, UpdateTestResultsService } from '@api/test-results';
import { TestResultModel } from '@models/test-result.model';
import { select, Store } from '@ngrx/store';
import {
  fetchTestResults,
  fetchTestResultsBySystemNumber,
  selectAllTestResults,
  selectAmendedDefectData,
  selectDefectData,
  selectedAmendedTestResultState,
  selectedTestResultState,
  TestResultsState,
  updateTestResultState
} from '@store/test-records';
import { Observable, throwError } from 'rxjs';

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

  fetchTestResultbySystemNumber(
    systemNumber: string,
    queryparams: {
      status?: string;
      fromDateTime?: Date;
      toDateTime?: Date;
      testResultId?: string;
      version?: string;
    } = {}
  ): Observable<Array<TestResultModel>> {
    if (!systemNumber) {
      return throwError(() => new Error('systemNumber is required'));
    }

    const { status, fromDateTime, toDateTime, testResultId, version } = queryparams;
    return this.getTestResultService.testResultsSystemNumberGet(systemNumber, status, fromDateTime, toDateTime, testResultId, version) as Observable<
      Array<TestResultModel>
    >;
  }

  loadTestResults(): void {
    this.store.dispatch(fetchTestResults());
  }

  loadTestResultBySystemNumber(systemNumber: string): void {
    this.store.dispatch(fetchTestResultsBySystemNumber({ systemNumber }));
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
    systemNumber: string,
    user: { username: string; id?: string },
    body: TestResultModel,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<TestResultModel[]> {
    const { username, id } = user;
    delete body.testHistory;
    return this.updateTestResultsService.testResultsTestResultIdPut(
      { msUserDetails: { msOid: id, msUser: username }, testResult: body as any } as TestResultPutBody,
      systemNumber,
      observe,
      reportProgress
    ) as unknown as Observable<TestResultModel[]>;
  }

  updateTestResultState({
    testResultId,
    testTypeId,
    section,
    value
  }: {
    testResultId: string;
    testTypeId: string;
    section: string;
    value: any;
  }): void {
    this.store.dispatch(updateTestResultState({ testResultId, testTypeId, section, value }));
  }
}
