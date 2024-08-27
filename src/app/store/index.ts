import { ActionReducerMap } from '@ngrx/store';
// eslint-disable-next-line import/no-cycle
import {
	GlobalErrorState,
	STORE_FEATURE_GLOBAL_ERROR_KEY,
	globalErrorReducer,
	initialGlobalErrorState,
} from '@store/global-error/reducers/global-error-service.reducer';
import {
	STORE_FEATURE_SPINNER_KEY,
	SpinnerState,
	initialSpinnerState,
	spinnerReducer,
} from '@store/spinner/reducers/spinner.reducer';
import { DefectsState, STORE_FEATURE_DEFECTS_KEY, defectsReducer, initialDefectsState } from './defects';
import {
	ReferenceDataState,
	STORE_FEATURE_REFERENCE_DATA_KEY,
	initialReferenceDataState,
	referenceDataReducer,
} from './reference-data';
import {
	RequiredStandardState,
	STORE_FEATURE_REQUIRED_STANDARDS_KEY,
	initialRequiredStandardsState,
	requiredStandardsReducer,
} from './required-standards/reducers/required-standards.reducer';
import {
	STORE_FEATURE_SEARCH_TECH_RESULTS_KEY,
	SearchResultState,
	initialTechSearchResultState,
	techSearchResultReducer,
} from './tech-record-search/reducer/tech-record-search.reducer';
import {
	STORE_FEATURE_TECHNICAL_RECORDS_KEY,
	TechnicalRecordServiceState,
	initialState as initialTechnicalRecordsState,
	vehicleTechRecordReducer,
} from './technical-records/reducers/technical-record-service.reducer';
import {
	STORE_FEATURE_TEST_RESULTS_KEY,
	TestResultsState,
	initialTestResultsState,
	testResultsReducer,
} from './test-records';
import {
	STORE_FEATURE_TEST_STATIONS_KEY,
	TestStationsState,
	initialTestStationsState,
	testStationsReducer,
} from './test-stations';
import {
	STORE_FEATURE_TEST_TYPES_KEY,
	TestTypeState,
	initialTestTypeState,
	testTypesReducer,
} from './test-types/reducers/test-types.reducer';
import {
	STORE_FEATURE_USER_KEY,
	UserServiceState,
	initialState as initialUserState,
	userServiceReducer,
} from './user/user-service.reducer';

export interface State {
	[STORE_FEATURE_DEFECTS_KEY]: DefectsState;
	[STORE_FEATURE_GLOBAL_ERROR_KEY]: GlobalErrorState;
	[STORE_FEATURE_REFERENCE_DATA_KEY]: ReferenceDataState;
	[STORE_FEATURE_SPINNER_KEY]: SpinnerState;
	[STORE_FEATURE_TECHNICAL_RECORDS_KEY]: TechnicalRecordServiceState;
	[STORE_FEATURE_TEST_RESULTS_KEY]: TestResultsState;
	[STORE_FEATURE_TEST_STATIONS_KEY]: TestStationsState;
	[STORE_FEATURE_TEST_TYPES_KEY]: TestTypeState;
	[STORE_FEATURE_USER_KEY]: UserServiceState;
	[STORE_FEATURE_SEARCH_TECH_RESULTS_KEY]: SearchResultState;
	[STORE_FEATURE_REQUIRED_STANDARDS_KEY]: RequiredStandardState;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	router?: any;
}

export const initialAppState = {
	[STORE_FEATURE_DEFECTS_KEY]: initialDefectsState,
	[STORE_FEATURE_GLOBAL_ERROR_KEY]: initialGlobalErrorState,
	[STORE_FEATURE_REFERENCE_DATA_KEY]: initialReferenceDataState,
	[STORE_FEATURE_SPINNER_KEY]: initialSpinnerState,
	[STORE_FEATURE_TECHNICAL_RECORDS_KEY]: initialTechnicalRecordsState,
	[STORE_FEATURE_TEST_RESULTS_KEY]: initialTestResultsState,
	[STORE_FEATURE_TEST_STATIONS_KEY]: initialTestStationsState,
	[STORE_FEATURE_TEST_TYPES_KEY]: initialTestTypeState,
	[STORE_FEATURE_USER_KEY]: initialUserState,
	[STORE_FEATURE_SEARCH_TECH_RESULTS_KEY]: initialTechSearchResultState,
	[STORE_FEATURE_REQUIRED_STANDARDS_KEY]: initialRequiredStandardsState,
};

export const reducers: ActionReducerMap<State> = {
	[STORE_FEATURE_DEFECTS_KEY]: defectsReducer,
	[STORE_FEATURE_GLOBAL_ERROR_KEY]: globalErrorReducer,
	[STORE_FEATURE_REFERENCE_DATA_KEY]: referenceDataReducer,
	[STORE_FEATURE_SPINNER_KEY]: spinnerReducer,
	[STORE_FEATURE_TECHNICAL_RECORDS_KEY]: vehicleTechRecordReducer,
	[STORE_FEATURE_TEST_RESULTS_KEY]: testResultsReducer,
	[STORE_FEATURE_TEST_STATIONS_KEY]: testStationsReducer,
	[STORE_FEATURE_TEST_TYPES_KEY]: testTypesReducer,
	[STORE_FEATURE_USER_KEY]: userServiceReducer,
	[STORE_FEATURE_SEARCH_TECH_RESULTS_KEY]: techSearchResultReducer,
	[STORE_FEATURE_REQUIRED_STANDARDS_KEY]: requiredStandardsReducer,
};
