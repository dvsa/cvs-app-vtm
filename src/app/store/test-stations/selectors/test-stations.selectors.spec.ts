import { testStationsAdapter, TestStationsState } from "../reducers/test-stations.reducer";
import { testStation, testStations, testStationsLoadingState } from "./test-stations.selectors";

describe('Test Results Selectors', () => {
  const initialTestStationsState = testStationsAdapter.getInitialState({ loading: false, error: '' });

  describe('adapter selectors', () => {
    it('should return correct state', () => {
      const state = { ...initialTestStationsState, ids: ['1'], entities: { ['1']: { preparerId: '2' } } };

      expect(testStations.projector(state)).toEqual([{ preparerId: '2' }]);
      expect(testStation('1').projector(state)).toEqual({ preparerId: '2' });
    });
  });

  describe('testStationsLoadingState', () => {
    it('should return loading state', () => {
      const state: TestStationsState = { ...initialTestStationsState, loading: true };
      const selectedState = testStationsLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });
});
