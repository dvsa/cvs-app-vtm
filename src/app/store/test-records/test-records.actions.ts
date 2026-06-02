import { GlobalError } from '@core/components/global-error/global-error.interface';
// eslint-disable-next-line import/no-cycle
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import {
	DefectDetailsSchema,
	SpecialistCustomDefectsSchemaPut,
	TestResultSchema,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';

export const fetchTestResults = createAction('[API/test-results] Fetch All');
export const fetchTestResultsSuccess = createAction(
	'[API/test-results] Fetch All Success',
	props<{ payload: Array<TestResultSchema> }>()
);
export const fetchTestResultsFailed = createAction('[API/test-results] Fetch All Failed', props<GlobalError>());

export const fetchTestResultsBySystemNumber = createAction(
	'[API/test-results] Fetch All By systemNumber',
	props<{ systemNumber: string }>()
);
export const fetchTestResultsBySystemNumberSuccess = createAction(
	'[API/test-results] Fetch All By systemNumber Success',
	props<{ payload: Array<TestResultSchema> }>()
);
export const fetchTestResultsBySystemNumberFailed = createAction(
	'[API/test-results] Fetch All By systemNumber Failed',
	props<GlobalError>()
);

export const fetchSelectedTestResult = createAction('[API/test-results], Fetch by ID');
export const fetchSelectedTestResultSuccess = createAction(
	'[API/test-results], Fetch by ID Success',
	props<{ payload: TestResultSchema }>()
);
export const fetchSelectedTestResultFailed = createAction(
	'[API/test-results], Fetch by ID Failed',
	props<GlobalError>()
);

export const createTestResult = createAction('[test-results] Create test result', props<{ value: TestResultSchema }>());
export const createTestResultSuccess = createAction(
	'[API/test-results] Create test result Success',
	props<{ payload: Update<TestResultSchema> }>()
);
export const createFailedFirstTestResultSuccess = createAction(
	'[API/test-results] Create failed first test result Success',
	props<{ payload: Update<TestResultSchema> }>()
);
export const createTestResultFailed = createAction(
	'[API/test-results] Create test result Failed',
	props<{ errors: GlobalError[] }>()
);

export const updateTestResult = createAction('[test-results] Update test result', props<{ value: TestResultSchema }>());
export const updateTestResultSuccess = createAction(
	'[API/test-results] Update test result Success',
	props<{ payload: Update<TestResultSchema> }>()
);
export const updateTestResultFailed = createAction(
	'[API/test-results] Update test result Failed',
	props<{ errors: GlobalError[] }>()
);

export const cleanTestResult = createAction('[test-results] Clean test result for submission');

export const editingTestResult = createAction('[test-results] Editing', props<{ testTypeId: string }>());

export const patchEditingTestResult = createAction(
	'[test-results] Patch editing',
	props<{ testResult: Partial<TestResultSchema> }>()
);

export const updateEditingTestResult = createAction(
	'[test-results] Update editing',
	props<{ testResult: TestResultSchema }>()
);
export const cancelEditingTestResult = createAction('[test-results] Cancel editing');

export const setResultOfTest = createAction(
	'[test-results] set the result of the test',
	props<{ result: TestResults }>()
);
export const updateResultOfTest = createAction('[test-results] update the result of the test');

export const initialContingencyTest = createAction(
	'[Contingency test] Create',
	props<{ testResult: Partial<TestResultSchema> }>()
);

export const contingencyTestTypeSelected = createAction(
	'[Test Results] contingency test type selected',
	props<{ testType: string }>()
);

export const testTypeIdChanged = createAction('[test-results] test type id changed', props<{ testTypeId: string }>());

export const templateSectionsChanged = createAction(
	'[test-results] Template sections changed',
	props<{ sectionTemplates: FormNode[]; sectionsValue: TestResultSchema | undefined }>()
);

export const createDefect = createAction('[test-results] create defect', props<{ defect: DefectDetailsSchema }>());
export const updateDefect = createAction(
	'[test-results] save defect',
	props<{ defect: DefectDetailsSchema; index: number }>()
);
export const removeDefect = createAction('[test-results] remove defect', props<{ index: number }>());

export const createRequiredStandard = createAction(
	'[test-results] create required standard',
	props<{ requiredStandard: SpecialistCustomDefectsSchemaPut }>()
);

export const updateRequiredStandard = createAction(
	'[test-results] update required standard',
	props<{ requiredStandard: SpecialistCustomDefectsSchemaPut; index: number }>()
);

export const removeRequiredStandard = createAction(
	'[test-results] remove required standard',
	props<{ index: number }>()
);

export const updateResultOfTestRequiredStandards = createAction('[test-results] update test result required standards');

export const getRecalls = createAction('[test-results] get recalls');
export const getRecallsSuccess = createAction(
	'[test-results] get recalls success',
	props<{ recalls: RecallsSchema }>()
);
export const getRecallsFailure = createAction('[test-results] get recalls failed', props<GlobalError>());

export const setTestResultLoading = createAction(
	'[test-results] set test result loading',
	props<{ loading: boolean }>()
);
