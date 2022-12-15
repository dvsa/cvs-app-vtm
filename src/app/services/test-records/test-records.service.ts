import { Injectable } from '@angular/core';
import { CompleteTestResults, DefaultService as CreateTestResultsService, GetTestResultsService, UpdateTestResultsService } from '@api/test-results';
import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { FormNode } from '@forms/services/dynamic-form.types';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-results/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import {
  cancelEditingTestResult,
  contingencyTestTypeSelected,
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
    user: { name: string; id?: string },
    body: TestResultModel,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<TestResultModel> {
    const { name, id } = user;
    const tr = cloneDeep(body);
    delete tr.testHistory;
    return this.updateTestResultsService.testResultsSystemNumberPut(
      { msUserDetails: { msOid: id, msUser: name }, testResult: tr as any } as CompleteTestResults,
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
    return this.store.pipe(select(toEditOrNotToEdit), this.canHandleTestType(masterTpl));
  }

  get canCreate$() {
    return this.store.pipe(select(toEditOrNotToEdit), this.canHandleTestType(contingencyTestTemplates));
  }

  private canHandleTestType(templateMap: Record<VehicleTypes, Record<string, Record<string, FormNode>>>) {
    return function <T>(source: Observable<T>): Observable<boolean> {
      const handle = (testResult: TestResultModel | undefined): boolean => {
        if (!testResult) {
          return false;
        }

        const vehicleType = testResult.vehicleType;
        const testTypeId = testResult.testTypes && testResult.testTypes[0].testTypeId;
        const testTypeGroup = TestRecordsService.getTestTypeGroup(testTypeId);
        const vehicleTpl = vehicleType && templateMap[vehicleType];

        return !!testTypeGroup && !!vehicleTpl && vehicleTpl.hasOwnProperty(testTypeGroup);
      };

      return new Observable(subscriber => {
        source.subscribe({
          next: val => {
            subscriber.next(handle(val as unknown as TestResultModel));
          },
          error: e => subscriber.error(e),
          complete: () => subscriber.complete()
        });
      });
    };
  }

  contingencyTestTypeSelected(testType: string) {
    this.store.dispatch(contingencyTestTypeSelected({ testType }));
  }
}
