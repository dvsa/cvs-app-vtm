import { DefectsState, initialDefectsState } from "../reducers/defects.reducer";
import { defect, defects, defectsLoadingState } from "./defects.selectors";

describe('Defects Selectors', () => {
  describe('adapter selectors', () => {
    it('should return correct state', () => {
      const state = { ...initialDefectsState, ids: [1], entities: { [1]: { preparerId: 2 } } };

      expect(defects.projector(state)).toEqual([{ preparerId: 2 }]);
      expect(defect('1').projector(state)).toEqual({ preparerId: 2 });
    });
  });

  describe('testStationsLoadingState', () => {
    it('should return loading state', () => {
      const state: DefectsState = { ...initialDefectsState, loading: true };
      const selectedState = defectsLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });
});
