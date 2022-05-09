import { TestResultModel } from '@models/test-result.model';
import { createAction, props } from '@ngrx/store';
import { GlobalError } from 'src/app/features/global-error/global-error.service';

export const fetchTestResults = createAction('[API/test-results] Fetch All');
export const fetchTestResultsSuccess = createAction('[API/test-results] Fetch All Success', props<{ payload: Array<TestResultModel> }>());
export const fetchTestResultsFailed = createAction('[API/test-results] Fetch All Failed', props<GlobalError>());

export const fetchTestResultsBySystemId = createAction('[API/test-results] Fetch All By systemId', props<{ systemId: string }>());
export const fetchTestResultsBySystemIdSuccess = createAction('[API/test-results] Fetch All By systemId Success', props<{ payload: Array<TestResultModel> }>());
export const fetchTestResultsBySystemIdFailed = createAction('[API/test-results] Fetch All By systemId Failed', props<GlobalError>());
