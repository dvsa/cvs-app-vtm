import { ActionReducerMap } from '@ngrx/store';
import {
  globalErrorReducer,
  GlobalErrorState,
  initialGlobalErrorState,
  STORE_GLOBAL_ERROR_KEY
} from '@store/global-error/reducers/global-error-service.reducer';
import { initialSpinnerState, spinnerReducer, SpinnerState, STORE_SPINNER_KEY } from '@store/spinner/reducers/spinner.reducer';
import { initialReferenceDataState, referenceDataReducer, ReferenceDataState, STORE_FEATURE_REFERENCE_DATA_KEY } from './reference-data';
import {
  initialState as initialTechnicalRecordsState,
  STORE_FEATURE_TECHNICAL_RECORDS_KEY,
  TechnicalRecordServiceState,
  vehicleTechRecordReducer
} from './technical-records/reducers/technical-record-service.reducer';
import { initialTestResultsState, STORE_FEATURE_TEST_RESULTS_KEY, testResultsReducer, TestResultsState } from './test-records';
import { initialTestStationsState, STORE_FEATURE_TEST_STATIONS_KEY, testStationsReducer, TestStationsState } from './test-stations';
import { initialTestTypeState, STORE_FEATURE_TEST_TYPES_KEY, testTypesReducer, TestTypeState } from './test-types/reducers/test-types.reducer';
import { initialState as initialUserState, STORE_FEATURE_USER_KEY, userServiceReducer, UserServiceState } from './user/user-service.reducer';

export interface State {
  [STORE_FEATURE_USER_KEY]: UserServiceState;
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: TechnicalRecordServiceState;
  [STORE_FEATURE_TEST_RESULTS_KEY]: TestResultsState;
  [STORE_GLOBAL_ERROR_KEY]: GlobalErrorState;
  [STORE_SPINNER_KEY]: SpinnerState;
  [STORE_FEATURE_REFERENCE_DATA_KEY]: ReferenceDataState;
  [STORE_FEATURE_TEST_STATIONS_KEY]: TestStationsState;
  [STORE_FEATURE_TEST_TYPES_KEY]: TestTypeState;
  router?: any;
}

export const initialAppState = {
  [STORE_FEATURE_USER_KEY]: initialUserState,
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: initialTechnicalRecordsState,
  [STORE_FEATURE_TEST_RESULTS_KEY]: initialTestResultsState,
  [STORE_GLOBAL_ERROR_KEY]: initialGlobalErrorState,
  [STORE_SPINNER_KEY]: initialSpinnerState,
  [STORE_FEATURE_REFERENCE_DATA_KEY]: initialReferenceDataState,
  [STORE_FEATURE_TEST_STATIONS_KEY]: initialTestStationsState,
  [STORE_FEATURE_TEST_TYPES_KEY]: initialTestTypeState
};

export const reducers: ActionReducerMap<State> = {
  [STORE_FEATURE_USER_KEY]: userServiceReducer,
  [STORE_FEATURE_TECHNICAL_RECORDS_KEY]: vehicleTechRecordReducer,
  [STORE_FEATURE_TEST_RESULTS_KEY]: testResultsReducer,
  [STORE_GLOBAL_ERROR_KEY]: globalErrorReducer,
  [STORE_SPINNER_KEY]: spinnerReducer,
  [STORE_FEATURE_REFERENCE_DATA_KEY]: referenceDataReducer,
  [STORE_FEATURE_TEST_STATIONS_KEY]: testStationsReducer,
  [STORE_FEATURE_TEST_TYPES_KEY]: testTypesReducer
};
