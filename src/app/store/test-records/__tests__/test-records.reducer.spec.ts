import { mockTestResultList } from '@mocks/mock-test-result';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Action } from '@ngrx/store';
import {
	cleanTestResult,
	createDefect,
	createRequiredStandard,
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
	removeDefect,
	removeRequiredStandard,
	updateDefect,
	updateRequiredStandard,
	updateResultOfTest,
	updateTestResult,
	updateTestResultFailed,
	updateTestResultSuccess,
} from '../test-records.actions';
import { TestResultsState, initialTestResultsState, testResultsReducer } from '../test-records.reducer';

describe('Test Results Reducer', () => {
	describe('unknown action', () => {
		it('should return the default state', () => {
			const action = {
				type: 'Unknown',
			};
			const state = testResultsReducer(initialTestResultsState, action);

			expect(state).toBe(initialTestResultsState);
		});
	});

	describe('fetchTestResults', () => {
		it('should set loading to true', () => {
			const oldState: TestResultsState = { ...initialTestResultsState, loading: false };
			const action = fetchTestResults();
			const state = testResultsReducer(oldState, action);

			expect(state.loading).toBe(true);
			expect(state).not.toBe(oldState);
		});
	});

	describe('fetchTestResultsSuccess', () => {
		it('should set all test result records', () => {
			const testResults = mockTestResultList(3);
			const newState: TestResultsState = {
				...initialTestResultsState,
				ids: ['TestResultId0001', 'TestResultId0002', 'TestResultId0003'],
				entities: {
					TestResultId0001: testResults[0],
					TestResultId0002: testResults[1],
					TestResultId0003: testResults[2],
				},
			};
			const action = fetchTestResultsSuccess({ payload: testResults });
			const state = testResultsReducer(initialTestResultsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('fetchTestResultsBySystemNumber actions', () => {
		it('should set loading to true', () => {
			const newState: TestResultsState = { ...initialTestResultsState, loading: true };
			const action = fetchTestResultsBySystemNumber({ systemNumber: 'TestResultId0001' });
			const state = testResultsReducer(initialTestResultsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('fetchTestResultsBySystemNumberSuccess', () => {
			it('should set all test result records', () => {
				const testResults = mockTestResultList();
				const newState: TestResultsState = {
					...initialTestResultsState,
					ids: ['TestResultId0001'],
					entities: { TestResultId0001: testResults[0] },
				};
				const action = fetchTestResultsBySystemNumberSuccess({ payload: testResults });
				const state = testResultsReducer(initialTestResultsState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});

		describe('fetchTestResultsBySystemNumberFailed', () => {
			it('should set error state', () => {
				const newState = { ...initialTestResultsState, loading: false };
				const action = fetchTestResultsBySystemNumberFailed({ error: 'unit testing error message' });
				const state = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});

	describe('fetchSelectedTestResult actions', () => {
		it('should set loading to true', () => {
			const newState: TestResultsState = { ...initialTestResultsState, loading: true };
			const action = fetchSelectedTestResult();
			const state = testResultsReducer(initialTestResultsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('fetchSelectedTestResultSuccess', () => {
			it('should set all test result records', () => {
				const testResults = mockTestResultList();
				const updatedTestResult = { ...testResults[0], odometerReading: 99999 };

				const newState: TestResultsState = {
					...initialTestResultsState,
					ids: [updatedTestResult.testResultId],
					entities: { [updatedTestResult.testResultId]: updatedTestResult },
				};
				const action = fetchSelectedTestResultSuccess({ payload: updatedTestResult });
				const state = testResultsReducer(initialTestResultsState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});

		describe('fetchSelectedTestResultFailed', () => {
			it('should set error state', () => {
				const newState = { ...initialTestResultsState, loading: false };
				const action = fetchSelectedTestResultFailed({ error: 'unit testing error message' });
				const state = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});

	describe('updateTestResult actions', () => {
		it('should set loading to true', () => {
			const state: TestResultsState = { ...initialTestResultsState, loading: true };
			const action = updateTestResult({ value: {} as TestResultModel });
			const newState = testResultsReducer(initialTestResultsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('updateTestResultSuccess', () => {
			it('should set loading to false', () => {
				const state: TestResultsState = { ...initialTestResultsState, loading: false };
				const action = updateTestResultSuccess({ payload: { id: '', changes: {} as TestResultModel } });
				const newState = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});

		describe('updateTestResultFailed', () => {
			it('should set loading to false', () => {
				const state: TestResultsState = { ...initialTestResultsState, loading: false };
				const action = updateTestResultFailed({ errors: [] });
				const newState = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});

	describe('calculateTestResult', () => {
		let action: Action;
		beforeEach(() => {
			action = updateResultOfTest();
		});

		it('should return a testType with a testResult of pass if empty defects', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'fail',
						defects: [],
					},
				],
			} as unknown as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('pass');
		});

		it('should not change the test result of defects key is not present', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'fail',
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toEqual(testResult.testTypes[0].testResult);
		});
		it('should return a testType with a testResult of pass if advisory defect', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'fail',
						defects: [
							{
								deficiencyCategory: 'advisory',
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('pass');
		});
		it('should return a testType with a testResult of pass if minor defect', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'fail',
						defects: [
							{
								deficiencyCategory: 'minor',
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('pass');
		});
		it('should return a testType with a testResult of pass if minor and advisory defect', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'fail',
						defects: [
							{
								deficiencyCategory: 'minor',
							},
							{
								deficiencyCategory: 'advisory',
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('pass');
		});
		it('should return a testType with a testResult of fail if at least one major defect', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'pass',
						defects: [
							{
								deficiencyCategory: 'major',
							},
							{
								deficiencyCategory: 'advisory',
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('fail');
		});
		it('should return a testType with a testResult of fail if at least one dangerous defect', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'pass',
						defects: [
							{
								deficiencyCategory: 'dangerous',
							},
							{
								deficiencyCategory: 'advisory',
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('fail');
		});
		it('should return a testType with a testResult of prs if major defect is prs and other defects are advisory', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'pass',
						defects: [
							{
								deficiencyCategory: 'major',
								prs: true,
							},
							{
								deficiencyCategory: 'advisory',
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('prs');
		});
		it('should return a testType with a testResult of fail if not all major/dangerous defects are prs', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'pass',
						defects: [
							{
								deficiencyCategory: 'major',
							},
							{
								deficiencyCategory: 'dangerous',
								prs: true,
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('fail');
		});
		it('should handle multiple testTypes', () => {
			const testResult = {
				testTypes: [
					{
						testResult: 'pass',
						defects: [
							{
								deficiencyCategory: 'major',
							},
							{
								deficiencyCategory: 'dangerous',
								prs: true,
							},
						],
					},
					{
						testResult: 'pass',
						defects: [
							{
								deficiencyCategory: 'dangerous',
								prs: true,
							},
						],
					},
					{
						testResult: 'fail',
						defects: [
							{
								deficiencyCategory: 'advisory',
								prs: true,
							},
						],
					},
				],
			} as TestResultModel;
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);
			expect(newState.editingTestResult?.testTypes[0].testResult).toBe('fail');
			expect(newState.editingTestResult?.testTypes[1].testResult).toBe('prs');
			expect(newState.editingTestResult?.testTypes[2].testResult).toBe('pass');
		});
	});

	describe('createDefect', () => {
		it('should create defect', () => {
			const defect = { imNumber: 2 } as TestResultDefect;
			const testResult = {
				testTypes: [
					{
						defects: [defect],
					},
				],
			} as unknown as TestResultModel;
			const action = createDefect({ defect });
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);

			expect(newState.editingTestResult?.testTypes[0].defects?.length).toBe(2);
		});
	});

	describe('updateDefect', () => {
		it('should update defect', () => {
			const defect = { imNumber: 2 } as TestResultDefect;
			const newDefect = { imNumber: 1 } as TestResultDefect;
			const testResult = {
				testTypes: [
					{
						defects: [defect],
					},
				],
			} as unknown as TestResultModel;
			const action = updateDefect({ defect: newDefect, index: 0 });
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);

			const path =
				newState.editingTestResult?.testTypes[0] &&
				newState.editingTestResult?.testTypes[0].defects &&
				newState.editingTestResult?.testTypes[0].defects[0].imNumber;

			expect(path).toBe(1);
		});
	});

	describe('removeDefect', () => {
		it('should remove defect', () => {
			const defect = { imNumber: 2 } as TestResultDefect;
			const testResult = {
				testTypes: [
					{
						defects: [defect],
					},
				],
			} as unknown as TestResultModel;
			const action = removeDefect({ index: 0 });
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);

			expect(newState.editingTestResult?.testTypes[0].defects?.length).toBe(0);
		});
	});

	describe('createRequiredStandard', () => {
		it('should create required standard', () => {
			const requiredStandard = { sectionNumber: 2 } as unknown as TestResultRequiredStandard;
			const testResult = {
				testTypes: [
					{
						requiredStandards: [requiredStandard],
					},
				],
			} as unknown as TestResultModel;
			const action = createRequiredStandard({ requiredStandard });
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);

			expect(newState.editingTestResult?.testTypes[0].requiredStandards?.length).toBe(2);
		});
	});

	describe('updateRequiredStandard', () => {
		it('should update required standard', () => {
			const requiredStandard = { sectionNumber: 2 } as unknown as TestResultRequiredStandard;
			const newRequiredStandard = { sectionNumber: 1 } as unknown as TestResultRequiredStandard;
			const testResult = {
				testTypes: [
					{
						requiredStandards: [requiredStandard],
					},
				],
			} as unknown as TestResultModel;
			const action = updateRequiredStandard({ requiredStandard: newRequiredStandard, index: 0 });
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);

			expect(newState.editingTestResult?.testTypes[0].requiredStandards?.length).toBe(1);
			expect(newState.editingTestResult?.testTypes?.at(0)?.requiredStandards?.at(0)?.sectionNumber).toBe(1);
		});
	});

	describe('removeRequiredStandard', () => {
		it('should remove required standard', () => {
			const requiredStandard = { sectionNumber: 2 } as unknown as TestResultRequiredStandard;
			const testResult = {
				testTypes: [
					{
						requiredStandards: [requiredStandard],
					},
				],
			} as unknown as TestResultModel;
			const action = removeRequiredStandard({ index: 0 });
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: testResult }, action);

			expect(newState.editingTestResult?.testTypes[0].requiredStandards?.length).toBe(0);
		});
	});

	describe('cleanTestResultPayload', () => {
		it('should return the state unaltered if no editing test result', () => {
			const action = cleanTestResult();
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult: undefined }, action);

			expect(newState).toStrictEqual({ ...initialTestResultsState, editingTestResult: undefined });
		});

		it('should return the state unaltered if no test type', () => {
			const editingTestResult = {
				foo: 'bar',
			} as unknown as TestResultModel;

			const action = cleanTestResult();
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult }, action);

			expect(newState).toStrictEqual({ ...initialTestResultsState, editingTestResult });
		});

		it('should return the state unaltered if required standards are populated', () => {
			const editingTestResult = {
				testTypes: [{ requiredStandards: ['I am a RS'], testTypeId: '125' }],
			} as unknown as TestResultModel;

			const action = cleanTestResult();
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult }, action);

			expect(newState).toStrictEqual({ ...initialTestResultsState, editingTestResult });
		});

		it('should return the state unaltered if test type is not spec 1 or spec 5', () => {
			const editingTestResult = {
				testTypes: [{ requiredStandards: ['I am a RS'], testTypeId: 'xyz' }],
			} as unknown as TestResultModel;

			const action = cleanTestResult();
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult }, action);

			expect(newState).toStrictEqual({ ...initialTestResultsState, editingTestResult });
		});

		it('should delete RS if empty from state', () => {
			const editingTestResult = {
				testTypes: [{ requiredStandards: [], testTypeId: '125' }],
			} as unknown as TestResultModel;

			const action = cleanTestResult();
			const newState = testResultsReducer({ ...initialTestResultsState, editingTestResult }, action);

			expect(newState.editingTestResult?.testTypes[0].requiredStandards).toBeUndefined();
		});
	});

	describe('getRecalls actions', () => {
		it('should set loading to true', () => {
			const newState: TestResultsState = { ...initialTestResultsState, loading: true };
			const action = getRecalls();
			const state = testResultsReducer(initialTestResultsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('getRequiredStandardsSuccess', () => {
			it('should set loading to false', () => {
				const newState: TestResultsState = { ...initialTestResultsState, loading: false };
				const action = getRecallsSuccess({ recalls: { hasRecall: true, manufacturer: 'Ford' } });
				const state = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});

			describe('getRequiredStandardsFailure', () => {
				it('should set loading to false', () => {
					const newState = { ...initialTestResultsState, loading: false };
					const action = getRecallsFailure({ error: 'unit testing error message' });
					const state = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

					expect(state).toEqual(newState);
					expect(state).not.toBe(newState);
				});
			});
		});
	});
});
