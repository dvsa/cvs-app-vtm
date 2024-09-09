import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Dictionary } from '@ngrx/entity';
import { ReferenceDataState, initialReferenceDataState } from '../reference-data.reducer';
import * as referenceDataSelectors from '../reference-data.selectors';
import { testCases } from '../reference-data.test-cases';

describe('Reference Data Selectors', () => {
	describe('selectAllReferenceDataByResourceType', () => {
		it.each(testCases)('should return all of the reference data for given resource type', (value) => {
			const { resourceType, payload } = value;
			const ids = payload.map((v) => v.resourceKey);
			const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
				(acc, v) => ({ ...acc, [v.resourceKey]: v }),
				{} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
			);
			const state: ReferenceDataState = { ...initialReferenceDataState, [resourceType]: { ids, entities } };

			const expectedState = referenceDataSelectors
				.selectAllReferenceDataByResourceType(resourceType)
				.projector(state[`${resourceType}`]);
			expect(expectedState).toHaveLength(mockCountriesOfRegistration.length);
			expect(expectedState).toEqual(payload);
		});
	});

	describe('selectReferenceDataByResourceKey', () => {
		it.each(testCases)('should return one specific reference data by type and key', (value) => {
			const { resourceType, payload } = value;
			const ids: string[] = payload.map((v) => v.resourceKey as string);
			const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
				(acc, v) => ({ ...acc, [v.resourceKey]: v }),
				{} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
			);
			const state: ReferenceDataState = {
				...initialReferenceDataState,
				COUNTRY_OF_REGISTRATION: { ids, entities, loading: false },
			};

			const key = ids[Math.floor(Math.random() * ids.length)]; // select a random key

			const expectedState = referenceDataSelectors.selectReferenceDataByResourceKey(resourceType, key).projector(state);
			expect(expectedState).toBe(mockCountriesOfRegistration.find((r) => r.resourceKey === key));
		});
	});

	describe('selectTyreSearchReturn', () => {
		it('should return the search return state to the user', () => {
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

			const state: ReferenceDataState = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.Tyres]: {
					...initialReferenceDataState[ReferenceDataResourceType.Tyres],
					loading: false,
					searchReturn: value.payload,
				},
			};

			const expectedState = referenceDataSelectors.selectSearchReturn(ReferenceDataResourceType.Tyres).projector(state);
			expect(expectedState).toBe(value.payload);
		});
	});
	describe('selectTyreSearchCriteria', () => {
		it('should return the filter and term state to the user', () => {
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

			const state: ReferenceDataState = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.Tyres]: {
					...initialReferenceDataState[ReferenceDataResourceType.Tyres],
					loading: false,
					searchReturn: value.payload,
					filter: 'cake',
					term: 'lies',
				},
			};

			const expectedState = referenceDataSelectors.selectTyreSearchCriteria.projector(state);
			expect(expectedState.filter).toBe('cake');
			expect(expectedState.term).toBe('lies');
		});
	});

	it('should return true if any feature is loading state', () => {
		const state: ReferenceDataState = { ...initialReferenceDataState };
		state.HGV_MAKE.loading = true;
		const selectedState = referenceDataSelectors.referenceDataLoadingState.projector(state);
		expect(selectedState).toBe(true);
	});

	it('should return the reasons for abandoning for the right vehicle type', () => {
		const selectorSpy = jest.spyOn(referenceDataSelectors, 'selectAllReferenceDataByResourceType');
		referenceDataSelectors.selectReasonsForAbandoning(VehicleTypes.PSV);
		expect(selectorSpy).toHaveBeenLastCalledWith(ReferenceDataResourceType.ReasonsForAbandoningPsv);
		referenceDataSelectors.selectReasonsForAbandoning(VehicleTypes.HGV);
		expect(selectorSpy).toHaveBeenLastCalledWith(ReferenceDataResourceType.ReasonsForAbandoningHgv);
		referenceDataSelectors.selectReasonsForAbandoning(VehicleTypes.TRL);
		expect(selectorSpy).toHaveBeenLastCalledWith(ReferenceDataResourceType.ReasonsForAbandoningTrl);
	});

	describe('selectRefDataBySearchTerm', () => {
		let state: ReferenceDataState;
		beforeEach(() => {
			state = {
				...initialReferenceDataState,
				[ReferenceDataResourceType.Tyres]: {
					...initialReferenceDataState[ReferenceDataResourceType.Tyres],
					loading: false,
					ids: [1, 11, 111, 101, 2],
					entities: {
						1: {
							resourceKey: 1,
							brakeCode: 1,
							resourceType: ReferenceDataResourceType.Tyres,
						} as ReferenceDataModelBase,
						11: {
							resourceKey: 11,
							brakeCode: 11,
							resourceType: ReferenceDataResourceType.Tyres,
						} as ReferenceDataModelBase,
						111: {
							resourceKey: 111,
							brakeCode: 111,
							resourceType: ReferenceDataResourceType.Tyres,
						} as ReferenceDataModelBase,
						101: {
							resourceKey: 101,
							brakeCode: 101,
							resourceType: ReferenceDataResourceType.Tyres,
						} as ReferenceDataModelBase,
						2: {
							resourceKey: 2,
							brakeCode: 2,
							resourceType: ReferenceDataResourceType.Tyres,
						} as ReferenceDataModelBase,
					},
				},
			};
		});
		it('should return only items that contain the search term 1', () => {
			const expectedState = referenceDataSelectors
				.selectRefDataBySearchTerm('1', ReferenceDataResourceType.Tyres, 'brakeCode')
				.projector(state);
			expect(expectedState).toEqual([
				{ resourceKey: 1, brakeCode: 1, resourceType: ReferenceDataResourceType.Tyres },
				{ resourceKey: 11, brakeCode: 11, resourceType: ReferenceDataResourceType.Tyres },
				{ resourceKey: 111, brakeCode: 111, resourceType: ReferenceDataResourceType.Tyres },
				{ resourceKey: 101, brakeCode: 101, resourceType: ReferenceDataResourceType.Tyres },
			]);
		});
		it('should return only items that contain the search term 11', () => {
			const expectedState = referenceDataSelectors
				.selectRefDataBySearchTerm('11', ReferenceDataResourceType.Tyres, 'brakeCode')
				.projector(state);
			expect(expectedState).toEqual([
				{ resourceKey: 11, brakeCode: 11, resourceType: ReferenceDataResourceType.Tyres },
				{ resourceKey: 111, brakeCode: 111, resourceType: ReferenceDataResourceType.Tyres },
			]);
		});
		it('should return only items that contain the search term 2', () => {
			const expectedState = referenceDataSelectors
				.selectRefDataBySearchTerm('2', ReferenceDataResourceType.Tyres, 'brakeCode')
				.projector(state);
			expect(expectedState).toEqual([{ resourceKey: 2, brakeCode: 2, resourceType: ReferenceDataResourceType.Tyres }]);
		});
		it('should return an empty array if there are no items to return', () => {
			const expectedState = referenceDataSelectors
				.selectRefDataBySearchTerm('3', ReferenceDataResourceType.Tyres, 'brakeCode')
				.projector(state);
			expect(expectedState).toEqual([]);
		});
	});
});
