import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import {
	DefectDetailsSchema,
	LoadStatusSchema,
	SpecialistCustomDefectsSchemaPut,
	TestResultSchema,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DeficiencyCategoryEnum } from '@models/test-results/test-result-defect.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import {
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2_DESK_BASED_TEST,
	TEST_TYPES_GROUP3_4_8,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP5_SPEC_TEST,
	TEST_TYPES_GROUP7,
	TEST_TYPES_GROUP8_NOTIFABLE,
	TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
	TEST_TYPES_GROUP15_16,
	TEST_TYPES_NON_VOLUNTARY_IVA_HGV_TRL,
} from '@models/testTypeId.enum';
// eslint-disable-next-line import/no-cycle
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import {
	cancelEditingTestResult,
	cleanTestResult,
	createDefect,
	createRequiredStandard,
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
	getRecalls,
	getRecallsFailure,
	getRecallsSuccess,
	initialContingencyTest,
	patchEditingTestResult,
	removeDefect,
	removeRequiredStandard,
	setResultOfTest,
	setTestResultLoading,
	templateSectionsChanged,
	updateDefect,
	updateEditingTestResult,
	updateRequiredStandard,
	updateResultOfTest,
	updateResultOfTestRequiredStandards,
	updateTestResult,
	updateTestResultFailed,
	updateTestResultSuccess,
} from './test-records.actions';

export const STORE_FEATURE_TEST_RESULTS_KEY = 'testRecords';

interface Extras {
	error: string;
	loading: boolean;
	editingTestResult?: TestResultSchema;
	sectionTemplates?: FormNode[];
	recalls?: RecallsSchema;
	recallsVin?: string;
	recallsLoading: boolean;
}

export interface TestResultsState extends EntityState<TestResultSchema>, Extras {}

const selectTestResultId = (a: TestResultSchema): string => {
	return a.testResultId;
};

export const testResultAdapter: EntityAdapter<TestResultSchema> = createEntityAdapter<TestResultSchema>({
	selectId: selectTestResultId,
});

export const initialTestResultsState: EntityState<TestResultSchema> & Extras = testResultAdapter.getInitialState({
	error: '',
	loading: false,
	recallsLoading: false,
});

export const testResultsReducer = createReducer(
	initialTestResultsState,
	on(fetchTestResults, (state) => ({ ...state, loading: true })),
	on(fetchTestResultsSuccess, (state, action) => ({
		...testResultAdapter.setAll(action.payload, state),
		loading: false,
	})),

	on(fetchTestResultsBySystemNumber, (state) => ({ ...state, loading: true })),
	on(fetchTestResultsBySystemNumberSuccess, (state, action) => ({
		...testResultAdapter.setAll(action.payload, state),
		loading: false,
	})),
	on(fetchTestResultsBySystemNumberFailed, (state) => ({ ...testResultAdapter.setAll([], state), loading: false })),

	on(fetchSelectedTestResult, (state) => ({ ...state, loading: true })),
	on(fetchSelectedTestResultSuccess, (state, action) => ({
		...testResultAdapter.upsertOne(action.payload, state),
		loading: false,
	})),
	on(fetchSelectedTestResultFailed, (state) => ({ ...state, loading: false })),

	on(getRecalls, (state, action) => ({
		...state,
		recalls: undefined,
		recallsVin: action.vin,
		recallsLoading: true,
	})),
	on(getRecallsSuccess, (state, action) => ({
		...state,
		recalls: action.recalls,
		recallsVin: action.vin,
		recallsLoading: false,
		editingTestResult: state.editingTestResult
			? merge({}, state.editingTestResult, { recalls: action.recalls })
			: undefined,
	})),
	on(getRecallsFailure, (state, action) => ({
		...state,
		recalls: undefined,
		recallsVin: action.vin,
		recallsLoading: false,
	})),

	on(createTestResult, updateTestResult, (state) => ({ ...state, loading: true })),
	on(updateTestResultSuccess, (state, action) => ({
		...testResultAdapter.updateOne(action.payload, state),
		loading: false,
	})),
	on(createTestResultSuccess, createTestResultFailed, updateTestResultFailed, (state) => ({
		...state,
		loading: false,
	})),

	on(updateResultOfTest, (state) => ({ ...state, editingTestResult: calculateTestResult(state.editingTestResult) })),
	on(setResultOfTest, (state, action) => ({
		...state,
		editingTestResult: setTestResult(state.editingTestResult, action.result),
	})),

	on(patchEditingTestResult, (state, action) => ({
		...state,
		editingTestResult: merge({}, state.editingTestResult, action.testResult),
	})),

	on(updateEditingTestResult, (state, action) => ({ ...state, editingTestResult: merge({}, action.testResult) })),
	on(cancelEditingTestResult, (state) => ({ ...state, editingTestResult: undefined, sectionTemplates: undefined })),

	on(initialContingencyTest, (state, action) => ({
		...state,
		editingTestResult: { ...action.testResult } as TestResultSchema,
	})),

	on(templateSectionsChanged, (state, action) => ({
		...state,
		sectionTemplates: action.sectionTemplates,
		editingTestResult: action.sectionsValue,
	})),

	on(createDefect, (state, action) => ({
		...state,
		editingTestResult: createNewDefect(state.editingTestResult, action.defect),
	})),
	on(updateDefect, (state, action) => ({
		...state,
		editingTestResult: updateDefectAtIndex(state.editingTestResult, action.defect, action.index),
	})),
	on(removeDefect, (state, action) => ({
		...state,
		editingTestResult: removeDefectAtIndex(state.editingTestResult, action.index),
	})),

	on(createRequiredStandard, (state, action) => ({
		...state,
		editingTestResult: createNewRequiredStandard(state.editingTestResult, action.requiredStandard),
	})),
	on(updateRequiredStandard, (state, action) => ({
		...state,
		editingTestResult: updateRequiredStandardAtIndex(state.editingTestResult, action.requiredStandard, action.index),
	})),
	on(removeRequiredStandard, (state, action) => ({
		...state,
		editingTestResult: removeRequiredStandardAtIndex(state.editingTestResult, action.index),
	})),

	on(updateResultOfTestRequiredStandards, (state) => ({
		...state,
		editingTestResult: calculateTestResultRequiredStandards(state.editingTestResult),
	})),

	on(cleanTestResult, (state) => ({ ...state, editingTestResult: cleanTestResultPayload(state.editingTestResult) })),

	on(setTestResultLoading, (state, action) => ({ ...state, loading: action.loading }))
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);

function createNewRequiredStandard(
	testResultState: TestResultSchema | undefined,
	requiredStandard: SpecialistCustomDefectsSchemaPut
) {
	if (!testResultState) {
		return;
	}
	const testResult = cloneDeep(testResultState);

	if (!testResult.testTypes[0].requiredStandards) {
		return;
	}
	testResult.testTypes[0].requiredStandards.push(requiredStandard);

	return { ...testResult };
}

export function cleanTestResultPayload(testResult: TestResultSchema | undefined) {
	if (!testResult || !testResult.testTypes) {
		return testResult;
	}

	// Ensure body model is null when empty, so it doesn't affect downstream services
	if (testResult.model === '') {
		testResult.model = null;
	}

	// Remove recalls from non HGV/PSV/TRL tests
	const vehicleType = testResult.vehicleType;
	const isHGV = vehicleType === VehicleTypes.HGV;
	const isPSV = vehicleType === VehicleTypes.PSV;
	const isTRL = vehicleType === VehicleTypes.TRL;

	if (!(isHGV || isPSV || isTRL)) {
		delete testResult.recalls;
	}

	const testTypes = testResult.testTypes.map((testType, index) => {
		// Remove empty requiredStandards from pass/prs non-voluntary IVA/MVSA tests
		if (index === 0) {
			const { testTypeId, requiredStandards } = testType;
			const isGroup1SpecTest = TEST_TYPES_GROUP1_SPEC_TEST.includes(testTypeId);
			const isGroup5SpecTest = TEST_TYPES_GROUP5_SPEC_TEST.includes(testTypeId);
			if ((isGroup1SpecTest || isGroup5SpecTest) && !(requiredStandards ?? []).length) {
				delete testType.requiredStandards;
			}
		}

		// If the test type is a fail/cancel/abandon, and issueRequired is true, set it to false
		const isFail = testType.testResult === TestResults.FAIL;
		const isAbandon = testType.testResult === TestResults.ABANDONED;
		if ((isFail || isAbandon) && testType.centralDocs?.issueRequired) {
			testType.centralDocs.issueRequired = false;
		}

		// If test type has issueRequired set to true, but not HGV/TRL IVA test, set the cert number to 000000
		if (
			testType.centralDocs?.issueRequired &&
			!(TEST_TYPES_NON_VOLUNTARY_IVA_HGV_TRL.includes(testType.testTypeId) && (isHGV || isTRL))
		) {
			testType.certificateNumber = '000000';
			testType.secondaryCertificateNumber = '000000';
		}

		// these test types don't require custom defects from the user, but BE need a customDefects property on the test type
		if (
			[
				...TEST_TYPES_GROUP7,
				...TEST_TYPES_GROUP5_13,
				...TEST_TYPES_GROUP15_16,
				...TEST_TYPES_GROUP8_NOTIFABLE,
				...TEST_TYPES_GROUP3_4_8,
			].includes(testType.testTypeId) &&
			!testType.customDefects
		) {
			testType.customDefects = [];
		}

		// if (testType.defects.length > 0) {
		//   testType.defects.forEach(defect => delete defect.metadata);
		// }

		// When abandoning a first test ensure certificate number is sent up
		if (isAbandon && TEST_TYPES_GROUP9_10_CENTRAL_DOCS.includes(testType.testTypeId)) {
			testType.certificateNumber = '';
		}

		if (
			(TEST_TYPES_GROUP2_DESK_BASED_TEST.includes(testType.testTypeId) ||
				TEST_TYPES_GROUP15_16.includes(testType.testTypeId)) &&
			testType.smokeTestKLimitApplied
		) {
			testType.smokeTestKLimitApplied = testType.smokeTestKLimitApplied.toString();
		}

		// If abandon reasons is an array, convert it to a string
		if (Array.isArray(testType.reasonForAbandoning)) {
			testType.reasonForAbandoning = testType.reasonForAbandoning.join('.');
		}

		// If required standards is an empty array, convert it to undefined
		if (Array.isArray(testType.requiredStandards) && testType.requiredStandards.length === 0) {
			testType.requiredStandards = undefined;
		}

		if (testType.loadStatus) {
			// If amending a historic test vehicle load status is not required, so if its not entered, delete load status
			if (testType.loadStatus.vehicleLoadStatus === null) {
				delete testType.loadStatus;
			} else {
				// Otherwise create a valid load status object
				const loadStatus: LoadStatusSchema = {
					vehicleLoadStatus: testType.loadStatus.vehicleLoadStatus,
				};

				if (testType.loadStatus.vehicleLoadStatus === VehicleLoadStatusType.UNLADEN) {
					loadStatus.unladenBodyType = testType.loadStatus.unladenBodyType;
					loadStatus.reasonForNotLoading = testType.loadStatus.reasonForNotLoading;

					if (testType.loadStatus.unladenBodyType === UnladenBodyType.OTHER) {
						loadStatus.otherUnladenBodyType = testType.loadStatus.otherUnladenBodyType;
					}

					if (testType.loadStatus.reasonForNotLoading === ReasonForNotLoading.OTHER) {
						loadStatus.otherReasonForNotLoading = testType.loadStatus.otherReasonForNotLoading;
					}
				}

				if (testType.loadStatus.vehicleLoadStatus === VehicleLoadStatusType.PARTIALLY_LADEN) {
					loadStatus.partiallyLadenReason = testType.loadStatus.partiallyLadenReason;
				}

				testType.loadStatus = loadStatus;
			}
		}

		return testType;
	});

	return { ...testResult, testTypes };
}

function updateRequiredStandardAtIndex(
	testResultState: TestResultSchema | undefined,
	requiredStandard: SpecialistCustomDefectsSchemaPut,
	index: number
) {
	if (!testResultState) {
		return;
	}
	const testResult = cloneDeep(testResultState);
	if (!testResult.testTypes[0].requiredStandards) {
		return;
	}
	testResult.testTypes[0].requiredStandards[`${index}`] = requiredStandard;

	return { ...testResult };
}

function removeRequiredStandardAtIndex(testResultState: TestResultSchema | undefined, index: number) {
	if (!testResultState) {
		return;
	}
	const testResult = cloneDeep(testResultState);
	if (!testResult.testTypes[0].requiredStandards) {
		return;
	}
	testResult.testTypes[0].requiredStandards.splice(index, 1);

	return { ...testResult };
}

function createNewDefect(
	testResultState: TestResultSchema | undefined,
	defect: DefectDetailsSchema
): TestResultSchema | undefined {
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

function updateDefectAtIndex(
	testResultState: TestResultSchema | undefined,
	defect: DefectDetailsSchema,
	index: number
): TestResultSchema | undefined {
	if (!testResultState) {
		return;
	}
	const testResult = cloneDeep(testResultState);
	if (!testResult.testTypes[0].defects) {
		return;
	}
	testResult.testTypes[0].defects[`${index}`] = defect;

	return { ...testResult };
}

function removeDefectAtIndex(
	testResultState: TestResultSchema | undefined,
	index: number
): TestResultSchema | undefined {
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

function calculateTestResult(testResultState: TestResultSchema | undefined): TestResultSchema | undefined {
	if (!testResultState) {
		return;
	}

	const testResult = cloneDeep(testResultState);

	const newTestTypes = testResult.testTypes.map((testType) => {
		if (
			testType.testResult === TestResults.ABANDONED ||
			!testType.defects ||
			TypeOfTest.DESK_BASED === testResultState?.typeOfTest
		) {
			return testType;
		}

		if (!testType.defects.length) {
			testType.testResult = TestResults.PASS;
			return testType;
		}

		const failOrPrs = testType.defects.some(
			(defect) =>
				defect.deficiencyCategory === DeficiencyCategoryEnum.Major ||
				defect.deficiencyCategory === DeficiencyCategoryEnum.Dangerous
		);
		if (!failOrPrs) {
			testType.testResult = TestResults.PASS;
			return testType;
		}

		testType.testResult = testType.defects.every(
			(defect) =>
				defect.deficiencyCategory === DeficiencyCategoryEnum.Advisory ||
				defect.deficiencyCategory === DeficiencyCategoryEnum.Minor ||
				(defect.deficiencyCategory === DeficiencyCategoryEnum.Dangerous && defect.prs) ||
				(defect.deficiencyCategory === DeficiencyCategoryEnum.Major && defect.prs)
		)
			? TestResults.PRS
			: TestResults.FAIL;

		return testType;
	});
	return { ...testResult, testTypes: [...newTestTypes] };
}

function calculateTestResultRequiredStandards(
	testResultState: TestResultSchema | undefined
): TestResultSchema | undefined {
	if (!testResultState) {
		return;
	}

	const testResult = cloneDeep(testResultState);

	const newTestTypes = testResult.testTypes.map((testType) => {
		if (
			testType.testResult === TestResults.ABANDONED ||
			!testType.requiredStandards ||
			TypeOfTest.DESK_BASED === testResultState?.typeOfTest
		) {
			return testType;
		}

		if (!testType.requiredStandards.length) {
			testType.testResult = TestResults.PASS;
			return testType;
		}

		testType.testResult = testType.requiredStandards.every((rs) => rs.prs) ? TestResults.PRS : TestResults.FAIL;

		return testType;
	});
	return { ...testResult, testTypes: [...newTestTypes] };
}

function setTestResult(testResult: TestResultSchema | undefined, result: TestResults): TestResultSchema | undefined {
	if (!testResult) {
		return;
	}
	const testResultCopy = cloneDeep(testResult);
	testResultCopy.testTypes[0].testResult = result;
	return testResultCopy;
}
