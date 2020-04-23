import {
  LoadPreparersSuccess, LoadTestStations,
  LoadTestStationsSuccess
} from '@app/store/actions/ReferenceData.actions';
import { initialReferenceDataState } from '@app/store/state/ReferenceDataState.state';
import { ReferenceDataReducers } from '@app/store/reducers/ReferenceData.reducers';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';

describe('Reference Data Reducer', () => {
  describe('[LoadPreparersSuccess]', () => {
    it('should update preparers', () => {
      const action = new LoadPreparersSuccess({} as Preparer[]);
      const result = ReferenceDataReducers(initialReferenceDataState, action);

      expect(result).toMatchObject({
        ...initialReferenceDataState,
        preparers: {} as Preparer[]
      });
    });
  });

  describe('[LoadTestStationsSuccess]', () => {
    it('should update testStations', () => {
      const action = new LoadTestStationsSuccess({} as TestStation[]);
      const result = ReferenceDataReducers(initialReferenceDataState, action);

      expect(result).toMatchObject({
        ...initialReferenceDataState,
        testStations: {} as TestStation[]
      });
    });
  });

  describe('LoadTestStations', () => {
    it('return current state value', () => {
      const result = ReferenceDataReducers(initialReferenceDataState, new LoadTestStations());

      expect(result).toMatchObject({
        ...initialReferenceDataState
      });
    });
  });

});
