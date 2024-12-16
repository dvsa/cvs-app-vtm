import { DeficiencyCategoryEnum, TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import {
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2_DESK_BASED_TEST,
	TEST_TYPES_GROUP5_SPEC_TEST,
	TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
	TEST_TYPES_GROUP15_16,
} from '@models/testTypeId.enum';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
// eslint-disable-next-line import/no-cycle
import { FormNode } from '@services/dynamic-forms/dynamic-form.types';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';
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
	initialContingencyTest,
	patchEditingTestResult,
	removeDefect,
	removeRequiredStandard,
	setResultOfTest,
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
	editingTestResult?: TestResultModel;
	sectionTemplates?: FormNode[];
}

export interface TestResultsState extends EntityState<TestResultModel>, Extras {}

const selectTestResultId = (a: TestResultModel): string => {
	return a.testResultId;
};

export const testResultAdapter: EntityAdapter<TestResultModel> = createEntityAdapter<TestResultModel>({
	selectId: selectTestResultId,
});

export const initialTestResultsState = testResultAdapter.getInitialState<Extras>({
	error: '',
	loading: false,
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
		editingTestResult: { ...action.testResult } as TestResultModel,
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

	on(cleanTestResult, (state) => ({ ...state, editingTestResult: cleanTestResultPayload(state.editingTestResult) }))
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);

function createNewRequiredStandard(
	testResultState: TestResultModel | undefined,
	requiredStandard: TestResultRequiredStandard
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

function cleanTestResultPayload(testResult: TestResultModel | undefined) {
	if (!testResult || !testResult.testTypes) {
		return testResult;
	}

	// Remove recalls from non HGV/PSV/TRL tests
	const vehicleType = testResult.vehicleType;
	if (!(vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.PSV || vehicleType === VehicleTypes.TRL)) {
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
		const isFail = testType.testResult === resultOfTestEnum.fail;
		const isAbandon = testType.testResult === resultOfTestEnum.abandoned;
		if ((isFail || isAbandon) && testType.centralDocs?.issueRequired) {
			testType.centralDocs.issueRequired = false;
		}

		// If test type has issueRequired set to true, set the certificateNumber/secondaryCertificateNumber to 000000
		if (testType.centralDocs?.issueRequired) {
			testType.certificateNumber = '000000';
			testType.secondaryCertificateNumber = '000000';
		}

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

		return testType;
	});

	return { ...testResult, testTypes };
}

function updateRequiredStandardAtIndex(
	testResultState: TestResultModel | undefined,
	requiredStandard: TestResultRequiredStandard,
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

function removeRequiredStandardAtIndex(testResultState: TestResultModel | undefined, index: number) {
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
	testResultState: TestResultModel | undefined,
	defect: TestResultDefect
): TestResultModel | undefined {
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
	testResultState: TestResultModel | undefined,
	defect: TestResultDefect,
	index: number
): TestResultModel | undefined {
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

function removeDefectAtIndex(testResultState: TestResultModel | undefined, index: number): TestResultModel | undefined {
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

function calculateTestResult(testResultState: TestResultModel | undefined): TestResultModel | undefined {
	if (!testResultState) {
		return;
	}

	const testResult = cloneDeep(testResultState);

	const newTestTypes = testResult.testTypes.map((testType) => {
		if (
			testType.testResult === resultOfTestEnum.abandoned ||
			!testType.defects ||
			TypeOfTest.DESK_BASED === testResultState?.typeOfTest
		) {
			return testType;
		}

		if (!testType.defects.length) {
			testType.testResult = resultOfTestEnum.pass;
			return testType;
		}

		const failOrPrs = testType.defects.some(
			(defect) =>
				defect.deficiencyCategory === DeficiencyCategoryEnum.Major ||
				defect.deficiencyCategory === DeficiencyCategoryEnum.Dangerous
		);
		if (!failOrPrs) {
			testType.testResult = resultOfTestEnum.pass;
			return testType;
		}

		testType.testResult = testType.defects.every(
			(defect) =>
				defect.deficiencyCategory === DeficiencyCategoryEnum.Advisory ||
				defect.deficiencyCategory === DeficiencyCategoryEnum.Minor ||
				(defect.deficiencyCategory === DeficiencyCategoryEnum.Dangerous && defect.prs) ||
				(defect.deficiencyCategory === DeficiencyCategoryEnum.Major && defect.prs)
		)
			? resultOfTestEnum.prs
			: resultOfTestEnum.fail;

		return testType;
	});
	return { ...testResult, testTypes: [...newTestTypes] };
}

function calculateTestResultRequiredStandards(
	testResultState: TestResultModel | undefined
): TestResultModel | undefined {
	if (!testResultState) {
		return;
	}

	const testResult = cloneDeep(testResultState);

	const newTestTypes = testResult.testTypes.map((testType) => {
		if (
			testType.testResult === resultOfTestEnum.abandoned ||
			!testType.requiredStandards ||
			TypeOfTest.DESK_BASED === testResultState?.typeOfTest
		) {
			return testType;
		}

		if (!testType.requiredStandards.length) {
			testType.testResult = resultOfTestEnum.pass;
			return testType;
		}

		testType.testResult = testType.requiredStandards.every((rs) => rs.prs)
			? resultOfTestEnum.prs
			: resultOfTestEnum.fail;

		return testType;
	});
	return { ...testResult, testTypes: [...newTestTypes] };
}

function setTestResult(testResult: TestResultModel | undefined, result: resultOfTestEnum): TestResultModel | undefined {
	if (!testResult) {
		return;
	}
	const testResultCopy = cloneDeep(testResult);
	testResultCopy.testTypes[0].testResult = result;
	return testResultCopy;
}
