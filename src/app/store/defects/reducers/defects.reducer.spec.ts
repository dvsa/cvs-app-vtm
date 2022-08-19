import { Defect } from '@models/defects/defect.model';
import { fetchDefect, fetchDefectFailed, fetchDefects, fetchDefectsFailed, fetchDefectsSuccess, fetchDefectSuccess } from '../actions/defects.actions';
import { defectsReducer, DefectsState, initialDefectsState } from './defects.reducer';

describe('Defects Reducer', () => {
  const expectedDefects = [ { imNumber: 1 } as Defect ];

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
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
          ids: [1],
          entities: { 1: expectedDefects[0] }
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
          ids: [1],
          entities: { [1]: expectedDefects[0] }
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
