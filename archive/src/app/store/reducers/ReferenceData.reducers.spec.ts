import {
  LoadPreparersSuccess,
  LoadTestStations,
  LoadTestStationsSuccess,
  LoadTestTypeCategoriesSuccess
} from '@app/store/actions/ReferenceData.actions';
import { initialReferenceDataState } from '@app/store/state/ReferenceDataState.state';
import { ReferenceDataReducers } from '@app/store/reducers/ReferenceData.reducers';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import { TEST_MODEL_UTILS } from '@app/utils';

describe('ReferenceDataReducers', () => {
  describe('[LoadPreparersSuccess]', () => {
    it('should update the ReferenceDataReducers reducer state with the correct payload once LoadPreparersSuccess is dispatched', () => {
      const preparer = { preparerId: '1', preparerName: 'test' } as Preparer;
      const action = new LoadPreparersSuccess([preparer]);
      const loadPreparers = ReferenceDataReducers(initialReferenceDataState, action);
      expect(loadPreparers).toMatchSnapshot();
    });
  });

  describe('[LoadTestStationsSuccess]', () => {
    it('should update the ReferenceDataReducers reducer state with the correct payload once LoadTestStationsSuccess is dispatched', () => {
      const testStation = { testStationPNumber: '2', testStationName: 'test' } as TestStation;
      const action = new LoadTestStationsSuccess([testStation]);
      const loadTestStations = ReferenceDataReducers(initialReferenceDataState, action);
      expect(loadTestStations).toMatchSnapshot();
    });
  });

  describe('[LoadTestTypeCategoriesSuccess]', () => {
    it('should update the ReferenceDataReducers reducer state with the correct payload once LoadTestTypeCategoriesSuccess is dispatched', () => {
      const testTypeCategory = TEST_MODEL_UTILS.mockTestTypeCategory();
      const action = new LoadTestTypeCategoriesSuccess([testTypeCategory]);
      const loadTestTypeCategories = ReferenceDataReducers(initialReferenceDataState, action);
      expect(loadTestTypeCategories).toMatchSnapshot();
    });
  });

  describe('should return default for different action', () => {
    it('return current state value', () => {
      const action = new LoadTestStations();
      const currentState = ReferenceDataReducers(initialReferenceDataState, action);
      expect(currentState).toMatchSnapshot();
    });
  });
});
