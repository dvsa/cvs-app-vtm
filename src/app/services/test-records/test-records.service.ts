import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteTestResults, GetTestResultsService, UpdateTestResultsService, DefaultService as CreateTestResultsService } from '@api/test-results';
import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-results/test-result.model';
import { select, Store } from '@ngrx/store';
import {
  cancelEditingTestResult,
  createTestResult,
  editingTestResult,
  fetchTestResults,
  fetchTestResultsBySystemNumber,
  isTestTypeKeySame,
  sectionTemplates,
  selectAllTestResults,
  selectAmendedDefectData,
  selectDefectData,
  selectedAmendedTestResultState,
  selectedTestResultState,
  testResultInEdit,
  TestResultsState,
  testTypeIdChanged,
  toEditOrNotToEdit,
  updateEditingTestResult,
  updateTestResult
} from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestRecordsService {
  constructor(
    private store: Store<TestResultsState>,
    private updateTestResultsService: UpdateTestResultsService,
    private getTestResultService: GetTestResultsService,
    private createTestResultsService: CreateTestResultsService
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
  get editingTestResult$() {
    return this.store.pipe(select(testResultInEdit));
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

  get sectionTemplates$() {
    return this.store.pipe(select(sectionTemplates));
  }

  saveTestResult(
    systemNumber: string,
    user: { username: string; id?: string },
    body: TestResultModel,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<TestResultModel> {
    const { username, id } = user;
    const tr = cloneDeep(body);
    delete tr.testHistory;
    return this.updateTestResultsService.testResultsSystemNumberPut(
      { msUserDetails: { msOid: id, msUser: username }, testResult: tr as any } as CompleteTestResults,
      systemNumber,
      observe,
      reportProgress
    ) as Observable<TestResultModel>;
  }

  updateTestResult(value: any): void {
    this.store.dispatch(updateTestResult({ value }));
  }

  postTestResult(body: TestResultModel) {
    return this.createTestResultsService.testResultsPost(body as CompleteTestResults, 'response', false);
  }

  createTestResult(value: any): void {
    this.store.dispatch(createTestResult({ value }));
  }

  static getTestTypeGroup(testTypeId: string): string | undefined {
    for (const groupName in TEST_TYPES) {
      if (TEST_TYPES[groupName as keyof typeof TEST_TYPES].includes(testTypeId)) {
        return groupName;
      }
    }
    return undefined;
  }

  editingTestResult(testResult: TestResultModel): void {
    this.store.dispatch(editingTestResult({ testTypeId: testResult.testTypes[0].testTypeId }));
  }

  cancelEditingTestResult(): void {
    this.store.dispatch(cancelEditingTestResult());
  }

  updateEditingTestResult(testResult: any): void {
    this.store.dispatch(updateEditingTestResult({ testResult }));
  }

  get isSameTestTypeId$(): Observable<boolean> {
    return this.store.pipe(select(isTestTypeKeySame('testTypeId')));
  }

  testTypeChange(testTypeId: string) {
    this.store.dispatch(testTypeIdChanged({ testTypeId }));
  }

  get isTestTypeGroupEditable$() {
    return this.store.pipe(select(toEditOrNotToEdit)).pipe(
      map(testResult => {
        if (!testResult) {
          return false;
        }

        const vehicleType = testResult.vehicleType;
        const testTypeId = testResult.testTypes && testResult.testTypes[0].testTypeId;
        const testTypeGroup = TestRecordsService.getTestTypeGroup(testTypeId);
        const vehicleTpl = vehicleType && masterTpl[vehicleType];

        return !!testTypeGroup && !!vehicleTpl && vehicleTpl.hasOwnProperty(testTypeGroup);
      })
    );
  }
}
