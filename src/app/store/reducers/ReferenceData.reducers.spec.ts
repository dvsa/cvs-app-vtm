import {
  LoadPreparersSuccess, LoadTestStations,
  LoadTestStationsSuccess
} from '@app/store/actions/ReferenceData.actions';
import { initialReferenceDataState } from '@app/store/state/ReferenceDataState.state';
import { ReferenceDataReducers } from '@app/store/reducers/ReferenceData.reducers';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';

describe('should update the ReferenceDataReducers with the correct state when the given initial state and action is given', () => {
  describe('[LoadPreparersSuccess]', () => {
    it('should update preparers value in state', () => {
      const action = new LoadPreparersSuccess({} as Preparer[]);
      const loadPreparers = ReferenceDataReducers(initialReferenceDataState, action);

      expect(loadPreparers).toMatchObject({
        ...initialReferenceDataState,
        preparers: {} as Preparer[]
      });
    });
  });

  describe('[LoadTestStationsSuccess]', () => {
    it('should update testStations value in state', () => {
      const action = new LoadTestStationsSuccess({} as TestStation[]);
      const loadTestStations = ReferenceDataReducers(initialReferenceDataState, action);

      expect(loadTestStations).toMatchObject({
        ...initialReferenceDataState,
        testStations: {} as TestStation[]
      });
    });
  });

  describe('should return default if action is different', () => {
    it('return current state value', () => {
      const currentState = ReferenceDataReducers(initialReferenceDataState, new LoadTestStations());

      expect(currentState).toMatchObject({
        ...initialReferenceDataState
      });
    });
  });

});
