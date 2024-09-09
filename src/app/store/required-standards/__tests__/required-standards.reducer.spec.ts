import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from '../required-standards.actions';
import {
	RequiredStandardState,
	initialRequiredStandardsState,
	requiredStandardsReducer,
} from '../required-standards.reducer';

describe('Required Standards Reducer', () => {
	const expectedRequiredStandards = {
		basic: [],
		normal: [],
		euVehicleCategories: ['m1'],
	};

	describe('unknown action', () => {
		it('should return the default state', () => {
			const action = {
				type: 'Unknown',
			};
			const state = requiredStandardsReducer(initialRequiredStandardsState, action);

			expect(state).toBe(initialRequiredStandardsState);
		});
	});

	describe('requiredStandards actions', () => {
		it('should set loading to true', () => {
			const newState: RequiredStandardState = { ...initialRequiredStandardsState, loading: true };
			const action = getRequiredStandards({ euVehicleCategory: 'm1' });
			const state = requiredStandardsReducer(initialRequiredStandardsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('getRequiredStandardsSuccess', () => {
			it('should set all test result records', () => {
				const newState: RequiredStandardState = {
					...initialRequiredStandardsState,
					requiredStandards: expectedRequiredStandards as unknown as DefectGETRequiredStandards,
				};
				const action = getRequiredStandardsSuccess({
					requiredStandards: expectedRequiredStandards as unknown as DefectGETRequiredStandards,
				});
				const state = requiredStandardsReducer(initialRequiredStandardsState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});

			describe('getRequiredStandardsFailure', () => {
				it('should set error state', () => {
					const newState = { ...initialRequiredStandardsState, loading: false };
					const action = getRequiredStandardsFailure({ error: 'unit testing error message' });
					const state = requiredStandardsReducer({ ...initialRequiredStandardsState, loading: true }, action);

					expect(state).toEqual(newState);
					expect(state).not.toBe(newState);
				});
			});
		});
	});
});
