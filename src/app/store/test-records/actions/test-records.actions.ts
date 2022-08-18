import { GlobalError } from '@core/components/global-error/global-error.interface';
import { FormNode } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-result.model';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

export const fetchTestResults = createAction('[API/test-results] Fetch All');
export const fetchTestResultsSuccess = createAction('[API/test-results] Fetch All Success', props<{ payload: Array<TestResultModel> }>());
export const fetchTestResultsFailed = createAction('[API/test-results] Fetch All Failed', props<GlobalError>());

export const fetchTestResultsBySystemNumber = createAction('[API/test-results] Fetch All By systemNumber', props<{ systemNumber: string }>());
export const fetchTestResultsBySystemNumberSuccess = createAction(
  '[API/test-results] Fetch All By systemNumber Success',
  props<{ payload: Array<TestResultModel> }>()
);
export const fetchTestResultsBySystemNumberFailed = createAction('[API/test-results] Fetch All By systemNumber Failed', props<GlobalError>());

export const fetchSelectedTestResult = createAction('[API/test-results], Fetch by ID');
export const fetchSelectedTestResultSuccess = createAction('[API/test-results], Fetch by ID Success', props<{ payload: TestResultModel }>());
export const fetchSelectedTestResultFailed = createAction('[API/test-results], Fetch by ID Failed', props<GlobalError>());

export const updateTestResult = createAction('[test-results] Update test result', props<{ value: TestResultModel }>());
export const updateTestResultSuccess = createAction('[API/test-results] Update test result Success', props<{ payload: Update<TestResultModel> }>());
export const updateTestResultFailed = createAction('[API/test-results] Update test result Failed', props<{ errors: GlobalError[] }>());

export const editingTestResult = createAction('[test-results] Editing', props<{ testResult: TestResultModel }>());
export const cancelEditingTestResult = createAction('[test-results] Cancel editing');
export const templateSectionsChanged = createAction(
  '[test-results] Template sections changed',
  props<{ sectionTemplates: FormNode[]; sectionsValue: TestResultModel | undefined }>()
);
export const updateEditingTestResult = createAction('[test-results] Update editing', props<{ testResult: TestResultModel }>());
