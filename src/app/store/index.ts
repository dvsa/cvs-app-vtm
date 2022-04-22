import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { initialState as initialTechnicalRecordsState, STORE_FEATURE_TECHNICAL_RECORDS_KEY, TechnicalRecordServiceState, vehicleTechRecordReducer } from './technical-records/technical-record-service.reducer';
import { initialTestResultsState, STORE_FEATURE_TEST_RESULTS_KEY, testResultsReducer, TestResultsState } from './test-records';
import { initialState as initialUserState, STORE_FEATURE_USER_KEY, userServiceReducer, UserServiceState } from './user/user-service.reducer';
import { globalErrorReducer, GlobalErrorState, initialGlobalErrorState, STORE_GLOBAL_ERROR_KEY } from '@store/global-error/reducers/global-error-service.reducer';

export interface State {
  [STORE_FEATURE_USER_KEY]: UserServiceState;
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: TechnicalRecordServiceState;
  [STORE_FEATURE_TEST_RESULTS_KEY]: TestResultsState;
  [STORE_GLOBAL_ERROR_KEY]: GlobalErrorState;
  router?: any;
}

export const initialAppState = {
  [STORE_FEATURE_USER_KEY]: initialUserState,
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: initialTechnicalRecordsState,
  [STORE_FEATURE_TEST_RESULTS_KEY]: initialTestResultsState,
  [STORE_GLOBAL_ERROR_KEY]: initialGlobalErrorState
};

export const reducers: ActionReducerMap<State> = {
  [STORE_FEATURE_USER_KEY]: userServiceReducer,
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: vehicleTechRecordReducer,
  [STORE_FEATURE_TEST_RESULTS_KEY]: testResultsReducer,
  [STORE_GLOBAL_ERROR_KEY]: globalErrorReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
