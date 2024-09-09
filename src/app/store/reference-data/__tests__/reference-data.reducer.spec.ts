import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Dictionary } from '@ngrx/entity';
import cloneDeep from 'lodash.clonedeep';
import {
	addSearchInformation,
	amendReferenceDataItemSuccess,
	createReferenceDataItemSuccess,
	deleteReferenceDataItemSuccess,
	fetchReferenceData,
	fetchReferenceDataAudit,
	fetchReferenceDataAuditFailed,
	fetchReferenceDataAuditSuccess,
	fetchReferenceDataByKey,
	fetchReferenceDataByKeyFailed,
	fetchReferenceDataByKeySearch,
	fetchReferenceDataByKeySearchFailed,
	fetchReferenceDataByKeySearchSuccess,
	fetchReferenceDataByKeySuccess,
	fetchReferenceDataFailed,
	fetchReferenceDataSuccess,
	fetchTyreReferenceDataByKeySearch,
	fetchTyreReferenceDataByKeySearchFailed,
	fetchTyreReferenceDataByKeySearchSuccess,
	removeTyreSearch,
} from '../reference-data.actions';
import { ReferenceDataState, initialReferenceDataState, referenceDataReducer } from '../reference-data.reducer';
import { testCases } from '../reference-data.test-cases';

describe('Reference Data Reducer', () => {
	describe('unknown action', () => {
		it('should return the default state', () => {
			const action = {
				type: 'Unknown',
			};
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toBe(initialReferenceDataState);
		});
	});

	describe('fetchReferenceData', () => {
		it('should set loading to true', () => {
			const newState: ReferenceDataState = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.CountryOfRegistration]: {
					...initialReferenceDataState[ReferenceDataResourceType.CountryOfRegistration],
					loading: true,
				},
			};
			const action = fetchReferenceData({ resourceType: ReferenceDataResourceType.CountryOfRegistration });
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('fetchReferenceDataSuccess', () => {
		it.each(testCases)('should set all reference data on success', (value) => {
			const { resourceType, payload } = value;
			const ids = payload.map((v) => v.resourceKey);
			const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
				(acc, v) => ({ ...acc, [v.resourceKey]: v }),
				{} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
			);
			const newState: ReferenceDataState = {
				...initialReferenceDataState,
				[resourceType]: { ids, entities, loading: false },
			};
			const action = fetchReferenceDataSuccess({ resourceType, payload: [...payload], paginated: false });
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('fetchReferenceDataFailed', () => {
		it('should set error state', () => {
			const newState = { ...initialReferenceDataState };
			const action = fetchReferenceDataFailed({
				error: 'unit testing error message',
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
			});
			const state = referenceDataReducer({ ...initialReferenceDataState }, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('fetchReferenceDataAudit', () => {
		it('should set loading to true', () => {
			const newState: ReferenceDataState = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.CountryOfRegistration]: {
					...initialReferenceDataState[ReferenceDataResourceType.CountryOfRegistration],
					loading: true,
				},
			};
			const action = fetchReferenceDataAudit({ resourceType: ReferenceDataResourceType.CountryOfRegistration });
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('fetchReferenceDataAuditSuccess', () => {
		it.each(testCases)('should set the the resource data item based on the type', (value) => {
			const { resourceType } = value;
			const newState: ReferenceDataState = {
				...initialReferenceDataState,
				[resourceType]: {
					...initialReferenceDataState[`${resourceType}`],
					searchReturn: value.payload,
					loading: false,
				},
			};

			const action = fetchReferenceDataAuditSuccess({ resourceType, payload: value.payload, paginated: false });
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('fetchReferenceDataAuditFailed', () => {
		it('should set error state', () => {
			const newState = { ...initialReferenceDataState };
			const action = fetchReferenceDataAuditFailed({
				error: 'unit testing error message',
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
			});
			const state = referenceDataReducer({ ...initialReferenceDataState }, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});
	});

	describe('fetchReferenceDataByKey actions', () => {
		it('should set loading to true', () => {
			const newState: ReferenceDataState = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.CountryOfRegistration]: {
					...initialReferenceDataState[ReferenceDataResourceType.CountryOfRegistration],
					loading: true,
				},
			};
			const action = fetchReferenceDataByKey({
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: mockCountriesOfRegistration[0].resourceKey,
			});
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('fetchReferenceDataByKeySuccess', () => {
			it.each(testCases)('should set the the resource data item based on the type and key', (value) => {
				const { resourceType, resourceKey, payload } = value;

				const entity = payload.find((p) => p.resourceKey === resourceKey) as ReferenceDataModelBase;
				const ids = [resourceKey];
				const entities: Dictionary<ReferenceDataModelBase> = { [resourceKey]: entity };
				const newState: ReferenceDataState = {
					...initialReferenceDataState,
					[resourceType]: { ids, entities, loading: false },
				};

				const action = fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: entity });
				const state = referenceDataReducer(initialReferenceDataState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});

		describe('fetchReferenceDataByKeyFailed', () => {
			it('should set error state', () => {
				const newState = { ...initialReferenceDataState };
				const action = fetchReferenceDataByKeyFailed({
					error: 'unit testing error message by key',
					resourceType: ReferenceDataResourceType.CountryOfRegistration,
				});
				const inputState = {
					...initialReferenceDataState,
					[ReferenceDataResourceType.CountryOfRegistration]: {
						...initialReferenceDataState[ReferenceDataResourceType.CountryOfRegistration],
						loading: true,
					},
				};
				const state = referenceDataReducer(inputState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});

	describe('fetchReferenceDataByKeySearch actions', () => {
		it('should set loading to true', () => {
			const newState: ReferenceDataState = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.Tyres]: {
					...initialReferenceDataState[ReferenceDataResourceType.Tyres],
					searchReturn: null,
					loading: true,
				},
			};
			const action = fetchReferenceDataByKeySearch({
				resourceType: ReferenceDataResourceType.Tyres,
				resourceKey: '101',
			});
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('fetchReferenceDataByKeySearchSuccess', () => {
			it('should set the the resource data item based on the type and key', () => {
				const resourceType = ReferenceDataResourceType.Tyres;
				const resourceKey = '123';
				const value = {
					payload: [
						{
							tyreCode: '123',
							resourceType: ReferenceDataResourceType.Tyres,
							resourceKey: '123',
							code: '123',
							loadIndexSingleLoad: '102',
							tyreSize: 'size',
							dateTimeStamp: 'time',
							userId: '1234',
							loadIndexTwinLoad: '101',
							plyRating: '18',
						},
					],
				};
				const newState: ReferenceDataState = {
					...initialReferenceDataState,
					[resourceType]: {
						...initialReferenceDataState[`${resourceType}`],
						searchReturn: value.payload,
						loading: false,
					},
				};

				const action = fetchReferenceDataByKeySearchSuccess({ resourceType, resourceKey, payload: value.payload });
				const state = referenceDataReducer(initialReferenceDataState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});

		describe('fetchReferenceDataByKeySearchFailed', () => {
			it('should set error state', () => {
				const newState = {
					...initialReferenceDataState,
					[ReferenceDataResourceType.Tyres]: {
						...initialReferenceDataState[ReferenceDataResourceType.Tyres],
						searchReturn: null,
						loading: false,
						filter: null,
						term: null,
					},
				};
				const action = fetchReferenceDataByKeySearchFailed({
					error: 'unit testing error message by key',
					resourceType: ReferenceDataResourceType.Tyres,
				});
				const inputState = {
					...initialReferenceDataState,
					[ReferenceDataResourceType.Tyres]: {
						...initialReferenceDataState[ReferenceDataResourceType.Tyres],
						loading: true,
					},
				};
				const state = referenceDataReducer(inputState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});

	describe('fetchTyreReferenceDataByKeySearch actions', () => {
		it('should set loading to true', () => {
			const newState: ReferenceDataState = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.Tyres]: {
					...initialReferenceDataState[ReferenceDataResourceType.Tyres],
					searchReturn: null,
					loading: true,
				},
			};
			const action = fetchTyreReferenceDataByKeySearch({
				searchTerm: 'plyrating',
				searchFilter: '101',
			});
			const state = referenceDataReducer(initialReferenceDataState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('fetchTyreReferenceDataByKeySearchSuccess', () => {
			it('should set the the resource data item based on the type and key', () => {
				const resourceType = ReferenceDataResourceType.Tyres;
				const value = {
					payload: [
						{
							tyreCode: '123',
							resourceType: ReferenceDataResourceType.Tyres,
							resourceKey: '123',
							code: '123',
							loadIndexSingleLoad: '102',
							tyreSize: 'size',
							dateTimeStamp: 'time',
							userId: '1234',
							loadIndexTwinLoad: '101',
							plyRating: '18',
						},
					],
				};
				const newState: ReferenceDataState = {
					...initialReferenceDataState,
					[resourceType]: {
						...initialReferenceDataState[`${resourceType}`],
						searchReturn: value.payload,
						loading: false,
					},
				};

				const action = fetchTyreReferenceDataByKeySearchSuccess({ resourceType, payload: value.payload });
				const state = referenceDataReducer(initialReferenceDataState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});

		describe('addSearchInformation', () => {
			it('should update state term and filter', () => {
				const newState = {
					...initialReferenceDataState,
					[ReferenceDataResourceType.Tyres]: {
						...initialReferenceDataState[ReferenceDataResourceType.Tyres],
						loading: false,
						filter: 'code',
						term: '103',
					},
				};

				const filter = 'code';
				const term = '103';
				const action = addSearchInformation({ filter, term });
				const state = referenceDataReducer(initialReferenceDataState, action);

				expect(state.TYRES).toStrictEqual(newState.TYRES);
			});
		});

		describe('removeTyreSearch', () => {
			it('should null search return', () => {
				const action = removeTyreSearch();
				const state = referenceDataReducer(initialReferenceDataState, action);

				expect(state.TYRES).toStrictEqual({
					ids: [],
					entities: {},
					loading: false,
					searchReturn: null,
					filter: null,
					term: null,
				});
			});
		});

		describe('fetchTyreReferenceDataByKeySearchFailed', () => {
			it('should set error state', () => {
				const newState = {
					...initialReferenceDataState,
					[ReferenceDataResourceType.Tyres]: {
						...initialReferenceDataState[ReferenceDataResourceType.Tyres],
						searchReturn: null,
						loading: false,
						filter: null,
						term: null,
					},
				};
				const action = fetchTyreReferenceDataByKeySearchFailed({
					error: 'unit testing error message by key',
					resourceType: ReferenceDataResourceType.Tyres,
				});
				const inputState = {
					...initialReferenceDataState,
					[ReferenceDataResourceType.Tyres]: {
						...initialReferenceDataState[ReferenceDataResourceType.Tyres],
						loading: true,
					},
				};
				const state = referenceDataReducer(inputState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});
	describe('deleteReferenceDataItemSuccess', () => {
		it('should remove the specified item from the reference data state', () => {
			const newItem = {
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test',
				description: 'test',
			};
			const inputState = cloneDeep(initialReferenceDataState);

			inputState[ReferenceDataResourceType.CountryOfRegistration].entities['test'] = newItem;
			inputState[ReferenceDataResourceType.CountryOfRegistration].ids = ['test'];
			const action = deleteReferenceDataItemSuccess({
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test',
			});

			const reducer = referenceDataReducer(inputState, action);
			expect(reducer).toEqual(initialReferenceDataState);
		});
		it('should leave any unspecified items in state', () => {
			const newItem = {
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test',
				description: 'test',
			};
			const newItem2 = {
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test2',
				description: 'test2',
			};
			const inputState = cloneDeep(initialReferenceDataState);

			inputState[ReferenceDataResourceType.CountryOfRegistration].entities['test'] = newItem;
			inputState[ReferenceDataResourceType.CountryOfRegistration].ids = ['test'];
			inputState[ReferenceDataResourceType.CountryOfRegistration].entities['test2'] = newItem2;
			inputState[ReferenceDataResourceType.CountryOfRegistration].ids = ['test2'];

			const action = deleteReferenceDataItemSuccess({
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test',
			});

			const reducer = referenceDataReducer(inputState, action);

			expect(reducer).not.toEqual(initialReferenceDataState);
			expect(reducer[ReferenceDataResourceType.CountryOfRegistration].entities).toEqual({ test2: newItem2 });
			expect(reducer[ReferenceDataResourceType.CountryOfRegistration].ids).toEqual(['test2']);
		});
	});
	describe('createReferenceDataItemSuccess', () => {
		it('should insert the new item into the reference data state', () => {
			const testItem = {
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test',
				description: 'test',
			};
			const testItem2 = {
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test2',
				description: 'test2',
			};
			const inputState = cloneDeep(initialReferenceDataState);
			inputState[ReferenceDataResourceType.CountryOfRegistration].entities = { test2: testItem2 };
			inputState[ReferenceDataResourceType.CountryOfRegistration].ids = ['test2'];

			const action = createReferenceDataItemSuccess({ result: testItem });
			const reducer = referenceDataReducer(inputState, action);
			expect(reducer[ReferenceDataResourceType.CountryOfRegistration].entities).toEqual({
				test: testItem,
				test2: testItem2,
			});
			expect(reducer[ReferenceDataResourceType.CountryOfRegistration].ids).toEqual(['test2', 'test']);
		});
	});
	describe('amendReferenceDataItemSuccess', () => {
		it('should insert the new item into the reference data state', () => {
			const itemToAmend = {
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test',
				description: 'test',
			};
			const amendedItem = {
				resourceType: ReferenceDataResourceType.CountryOfRegistration,
				resourceKey: 'test',
				description: 'this has been amended',
			};
			const inputState = cloneDeep(initialReferenceDataState);
			inputState[ReferenceDataResourceType.CountryOfRegistration].entities = { test: itemToAmend };
			inputState[ReferenceDataResourceType.CountryOfRegistration].ids = ['test'];

			const action = amendReferenceDataItemSuccess({ result: amendedItem });
			const reducer = referenceDataReducer(inputState, action);

			expect(reducer[ReferenceDataResourceType.CountryOfRegistration].entities).toEqual({ test: amendedItem });
			expect(reducer[ReferenceDataResourceType.CountryOfRegistration].ids).toEqual(['test']);
		});
	});
});
