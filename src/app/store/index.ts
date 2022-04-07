import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { initialState as initialTechnicalRecordsState, STORE_FEATURE_TECHNICAL_RECORDS_KEY, TechnicalRecordServiceState, vehicleTechRecordReducer } from './technical-records/technical-record-service.reducer';
import { initialState as initialUserState, STORE_FEATURE_USER_KEY, userServiceReducer, UserServiceState } from './user/user-service.reducer';
import { initialState as initialTestRecordState, STORE_FEATURE_TEST_RECORD_KEY, testRecordServiceReducer, TestRecordServiceState } from './user/user-service.reducer';

export interface State {
  [STORE_FEATURE_USER_KEY]: UserServiceState;
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: TechnicalRecordServiceState;
  [STORE_FEATURE_TEST_RECORD_KEY]: TestRecordServiceState;
}

export const initialAppState = {
  [STORE_FEATURE_USER_KEY]: initialUserState,
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: initialTechnicalRecordsState,
  [STORE_FEATURE_TEST_RECORD_KEY]: initialTestRecordState
}

export const reducers: ActionReducerMap<State> = {
  [STORE_FEATURE_USER_KEY]: userServiceReducer,
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: vehicleTechRecordReducer,
  [STORE_FEATURE_TEST_RECORD_KEY]: testRecordServiceReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
