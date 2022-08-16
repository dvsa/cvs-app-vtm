import { Injectable } from '@angular/core';
import { GetTestResultsService, CompleteTestResults, UpdateTestResultsService } from '@api/test-results';
import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
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
  updateTestResult
} from '@store/test-records';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestRecordsService {
  constructor(
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
  ): Observable<TestResultModel> {
    const { username, id } = user;
    delete body.testHistory;
    return this.updateTestResultsService.testResultsSystemNumberPut(
      { msUserDetails: { msOid: id, msUser: username }, testResult: body as any } as CompleteTestResults,
      systemNumber,
      observe,
      reportProgress
    ) as Observable<TestResultModel>;
  }

  updateTestResult(value: any): void {
    this.store.dispatch(updateTestResult({ value }));
  }

  static getTestTypeGroup(testTypeId: string): string | undefined {
    for (const groupName in TEST_TYPES) {
      if (TEST_TYPES[groupName as keyof typeof TEST_TYPES].includes(testTypeId)) {
        return groupName;
      }
    }
    return undefined;
  }
}
