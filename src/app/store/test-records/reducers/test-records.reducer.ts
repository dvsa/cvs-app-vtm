import { FormNode } from '@forms/services/dynamic-form.types';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import {
  cancelEditingTestResult,
  createDefect,
  createTestResult,
  createTestResultFailed,
  createTestResultSuccess,
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResults,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  fetchTestResultsSuccess,
  initialContingencyTest,
  removeDefect,
  setResultOfTest,
  templateSectionsChanged,
  updateDefect,
  updateEditingTestResult,
  updateResultOfTest,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';

export const STORE_FEATURE_TEST_RESULTS_KEY = 'testRecords';

interface Extras {
  error: string;
  loading: boolean;
  editingTestResult?: TestResultModel;
  sectionTemplates?: FormNode[];
}

export interface TestResultsState extends EntityState<TestResultModel>, Extras {}

const selectTestResultId = (a: TestResultModel): string => {
  return a.testResultId;
};

export const testResultAdapter: EntityAdapter<TestResultModel> = createEntityAdapter<TestResultModel>({ selectId: selectTestResultId });

export const initialTestResultsState = testResultAdapter.getInitialState<Extras>({
  error: '',
  loading: false
});

export const testResultsReducer = createReducer(
  initialTestResultsState,
  on(fetchTestResults, state => ({ ...state, loading: true })),
  on(fetchTestResultsSuccess, (state, action) => ({ ...testResultAdapter.setAll(action.payload, state), loading: false })),

  on(fetchTestResultsBySystemNumber, state => ({ ...state, loading: true })),
  on(fetchTestResultsBySystemNumberSuccess, (state, action) => ({ ...testResultAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestResultsBySystemNumberFailed, state => ({ ...testResultAdapter.setAll([], state), loading: false })),

  on(fetchSelectedTestResult, state => ({ ...state, loading: true })),
  on(fetchSelectedTestResultSuccess, (state, action) => ({ ...testResultAdapter.upsertOne(action.payload, state), loading: false })),
  on(fetchSelectedTestResultFailed, state => ({ ...state, loading: false })),

  on(createTestResult, updateTestResult, state => ({ ...state, loading: true })),
  on(updateTestResultSuccess, (state, action) => ({
    ...testResultAdapter.updateOne(action.payload, state),
    loading: false
  })),
  on(createTestResultSuccess, createTestResultFailed, updateTestResultFailed, state => ({ ...state, loading: false })),

  on(updateResultOfTest, state => ({ ...state, editingTestResult: calculateTestResult(state.editingTestResult) })),
  on(setResultOfTest, (state, action) => ({ ...state, editingTestResult: setTestResult(state.editingTestResult, action.result) })),

  on(updateEditingTestResult, (state, action) => ({ ...state, editingTestResult: merge({}, action.testResult) })),
  on(cancelEditingTestResult, state => ({ ...state, editingTestResult: undefined, sectionTemplates: undefined })),

  on(initialContingencyTest, (state, action) => ({
    ...state,
    editingTestResult: { ...action.testResult } as TestResultModel
  })),

  on(templateSectionsChanged, (state, action) => ({ ...state, sectionTemplates: action.sectionTemplates, editingTestResult: action.sectionsValue })),

  on(createDefect, (state, action) => ({ ...state, editingTestResult: createNewDefect(state.editingTestResult, action.defect) })),
  on(updateDefect, (state, action) => ({ ...state, editingTestResult: updateDefectAtIndex(state.editingTestResult, action.defect, action.index) })),
  on(removeDefect, (state, action) => ({ ...state, editingTestResult: removeDefectAtIndex(state.editingTestResult, action.index) }))
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);

function createNewDefect(testResultState: TestResultModel | undefined, defect: TestResultDefect): TestResultModel | undefined {
  if (!testResultState) {
    return;
  }
  const testResult = cloneDeep(testResultState);

  if (!testResult.testTypes[0].defects) {
    return;
  }
  testResult.testTypes[0].defects.push(defect);

  return { ...testResult };
}

function updateDefectAtIndex(testResultState: TestResultModel | undefined, defect: TestResultDefect, index: number): TestResultModel | undefined {
  if (!testResultState) {
    return;
  }
  const testResult = cloneDeep(testResultState);
  if (!testResult.testTypes[0].defects) {
    return;
  }
  testResult.testTypes[0].defects[index] = defect;

  return { ...testResult };
}

function removeDefectAtIndex(testResultState: TestResultModel | undefined, index: number): TestResultModel | undefined {
  if (!testResultState) {
    return;
  }
  const testResult = cloneDeep(testResultState);
  if (!testResult.testTypes[0].defects) {
    return;
  }
  testResult.testTypes[0].defects.splice(index, 1);

  return { ...testResult };
}

function calculateTestResult(testResultState: TestResultModel | undefined): TestResultModel | undefined {
  if (!testResultState) {
    return;
  }

  const testResult = cloneDeep(testResultState);

  const newTestTypes = testResult.testTypes.map(testType => {
    if (testType.testResult === resultOfTestEnum.abandoned || !testType.defects || TypeOfTest.DESK_BASED === testResultState?.typeOfTest) {
      return testType;
    }

    if (!testType.defects.length) {
      testType.testResult = resultOfTestEnum.pass;
      return testType;
    }

    const failOrPrs = testType.defects.some(
      defect =>
        defect.deficiencyCategory === TestResultDefect.DeficiencyCategoryEnum.Major ||
        defect.deficiencyCategory === TestResultDefect.DeficiencyCategoryEnum.Dangerous
    );
    if (!failOrPrs) {
      testType.testResult = resultOfTestEnum.pass;
      return testType;
    }

    testType.testResult = testType.defects.every(
      defect =>
        defect.deficiencyCategory === TestResultDefect.DeficiencyCategoryEnum.Advisory ||
        defect.deficiencyCategory === TestResultDefect.DeficiencyCategoryEnum.Minor ||
        (defect.deficiencyCategory === TestResultDefect.DeficiencyCategoryEnum.Dangerous && defect.prs) ||
        (defect.deficiencyCategory === TestResultDefect.DeficiencyCategoryEnum.Major && defect.prs)
    )
      ? resultOfTestEnum.prs
      : resultOfTestEnum.fail;

    return testType;
  });
  return { ...testResult, testTypes: [...newTestTypes] };
}

function setTestResult(testResult: TestResultModel | undefined, result: resultOfTestEnum): TestResultModel | undefined {
  if (!testResult) {
    return;
  }
  const testResultCopy = cloneDeep(testResult);
  testResultCopy.testTypes[0].testResult = result;
  return testResultCopy;
}
