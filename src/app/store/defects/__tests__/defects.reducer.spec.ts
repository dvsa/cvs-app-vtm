import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import {
	deleteDefect,
	deleteDefectFailed,
	deleteDefectSuccess,
	fetchDefect,
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from '../defects.actions';
import { DefectsState, defectsReducer, initialDefectsState } from '../defects.reducer';

describe('Defects Reducer', () => {
	const expectedDefects = [{ imNumber: 1, imDescription: 'some description' } as DefectCategoryReferenceDataSchema];

	it('removes only the deleted category and its nested data after success', () => {
		const otherCategory = { ...expectedDefects[0], imNumber: 2 };
		const loaded = defectsReducer(
			initialDefectsState,
			fetchDefectsSuccess({ payload: [...expectedDefects, otherCategory] })
		);
		const pending = defectsReducer(loaded, deleteDefect({ id: 1 }));
		expect(pending.loading).toBe(true);
		expect(pending.entities).toEqual(loaded.entities);
		const deleted = defectsReducer(pending, deleteDefectSuccess({ id: 1 }));
		expect(deleted.loading).toBe(false);
		expect(Object.values(deleted.entities)).toEqual([otherCategory]);
	});

	it('retains the category and enables retry when deletion fails', () => {
		const loaded = defectsReducer(initialDefectsState, fetchDefectsSuccess({ payload: expectedDefects }));
		const failed = defectsReducer(
			defectsReducer(loaded, deleteDefect({ id: 1 })),
			deleteDefectFailed({ error: 'Deletion failed' })
		);
		expect(failed.entities).toEqual(loaded.entities);
		expect(failed.loading).toBe(false);
		expect(failed.error).toBe('Deletion failed');
	});

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
			const newState: DefectsState = { ...initialDefectsState, loading: true };
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
					const newState = { ...initialDefectsState, loading: false };
					const action = fetchDefectsFailed({ error: 'unit testing error message' });
					const state = defectsReducer({ ...initialDefectsState, loading: true }, action);

					expect(state).toEqual(newState);
					expect(state).not.toBe(newState);
				});
			});
		});
	});

	describe('fetchDefect actions', () => {
		it('should set loading to true', () => {
			const newState: DefectsState = { ...initialDefectsState, loading: true };
			const action = fetchDefect({ id: 1 });
			const state = defectsReducer(initialDefectsState, action);

			expect(state).toEqual(newState);
			expect(state).not.toBe(newState);
		});

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
				const newState = { ...initialDefectsState, loading: false };
				const action = fetchDefectFailed({ error: 'unit testing error message' });
				const state = defectsReducer({ ...initialDefectsState, loading: true }, action);

				expect(state).toEqual(newState);
				expect(state).not.toBe(newState);
			});
		});
	});
});
