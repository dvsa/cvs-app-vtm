import { createAction, props } from '@ngrx/store';
import { TestResultModel } from 'archive/src/app/models/test-result.model';

export const fetchTestResults = createAction('[API/test-results] Fetch All');
export const fetchTestResultsSuccess = createAction('[API/test-results] Fetch All Success', props<{ payload: Array<TestResultModel> }>());
export const fetchTestResultsFailed = createAction('[API/test-results] Fetch All Failed', props<{error: string}>());

export const fetchTestResultBySystemId = createAction('[API/test-results] Fetch One', props<{systemId: string}>());
export const fetchTestResultBySystemIdSuccess = createAction('[API/test-results] Fetch One Success', props<{ payload: TestResultModel }>());
export const fetchTestResultBySystemIdFailed = createAction('[API/test-results] Fetch One Failed', props<{error: string}>());
