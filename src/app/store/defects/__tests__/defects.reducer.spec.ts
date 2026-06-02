import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import {
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from '../defects.actions';
import { DefectsState, defectsReducer, initialDefectsState } from '../defects.reducer';

describe('Defects Reducer', () => {
	const expectedDefects = [{ imNumber: 1, imDescription: 'some description' } as DefectCategoryReferenceDataSchema];

	describe('unknown action', () => {
		it('should return the default state', () => {
			const action = {
				type: 'Unknown',
			};
			const state = defectsReducer(initialDefectsState, action);

			expect(state).toBe(initialDefectsState);
		});
	});

	describe('fetchDefects actions', () => {
		it('should set loading to true', () => {
			const newState: DefectsState = { ...initialDefectsState };
			const action = fetchDefects();
			const state = defectsReducer(initialDefectsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

		describe('fetchDefectsSuccess', () => {
			it('should set all test result records', () => {
				const newState: DefectsState = {
					...initialDefectsState,
					ids: ['1: some description'],
					entities: { '1: some description': expectedDefects[0] },
				};
				const action = fetchDefectsSuccess({ payload: [...expectedDefects] });
				const state = defectsReducer(initialDefectsState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});

			describe('fetchDefectsFailed', () => {
				it('should set error state', () => {
					const newState = { ...initialDefectsState };
					const action = fetchDefectsFailed({ error: 'unit testing error message' });
					const state = defectsReducer({ ...initialDefectsState }, action);

					expect(state).toEqual(newState);
					expect(state).not.toBe(newState);
				});
			});
		});
	});

	describe('fetchDefect actions', () => {
		describe('fetchDefectSuccess', () => {
			it('should set all test result records', () => {
				const newState: DefectsState = {
					...initialDefectsState,
					ids: ['1: some description'],
					entities: { '1: some description': expectedDefects[0] },
				};
				const action = fetchDefectSuccess({ id: 1, payload: expectedDefects[0] });
				const state = defectsReducer(initialDefectsState, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});

		describe('fetchDefectFailed', () => {
			it('should set error state', () => {
				const newState = { ...initialDefectsState };
				const action = fetchDefectFailed({ error: 'unit testing error message' });
				const state = defectsReducer({ ...initialDefectsState }, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});
});
