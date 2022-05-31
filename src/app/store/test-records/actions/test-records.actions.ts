import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TestResultModel } from '@models/test-result.model';
import { createAction, props } from '@ngrx/store';

export const fetchTestResults = createAction('[API/test-results] Fetch All');
export const fetchTestResultsSuccess = createAction('[API/test-results] Fetch All Success', props<{ payload: Array<TestResultModel> }>());
export const fetchTestResultsFailed = createAction('[API/test-results] Fetch All Failed', props<GlobalError>());

export const fetchTestResultsBySystemId = createAction('[API/test-results] Fetch All By systemId', props<{ systemId: string }>());
export const fetchTestResultsBySystemIdSuccess = createAction('[API/test-results] Fetch All By systemId Success', props<{ payload: Array<TestResultModel> }>());
export const fetchTestResultsBySystemIdFailed = createAction('[API/test-results] Fetch All By systemId Failed', props<GlobalError>());

export const fetchSelectedTestResult = createAction('[], Fetch test result by ID');
export const fetchSelectedTestResultSuccess = createAction('[], Fetch Test Result by ID Success', props<{ payload: TestResultModel }>());
export const fetchSelectedTestResultFailed = createAction('[], Fetch Test Result by ID Failed', props<GlobalError>());
