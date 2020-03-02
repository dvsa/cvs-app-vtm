import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import {
  EReferenceDataActions,
  LoadPreparers,
  LoadPreparersSuccess,
  LoadTestStations,
  LoadTestStationsSuccess
} from '@app/store/actions/ReferenceData.actions';

describe('LoadPreparers', () => {
  it('should have the correct action type when LoadPreparers() action is instantiated', () => {
    const actionInstance = new LoadPreparers();
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadPreparers
    });
  });
});

describe('LoadTestStations', () => {
  it('should have the correct action type & payload when LoadTestStations() action is instantiated', () => {
    const actionInstance = new LoadTestStations();
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadTestStations
    });
  });
});

describe('LoadPreparersSuccess', () => {
  it('should have the correct action type & preparers payload when LoadPreparersSuccess() action is instantiated', () => {
    const actionInstance = new LoadPreparersSuccess({} as Preparer[]);
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadPreparersSuccess,
      preparers: {} as Preparer[]
    });
  });
});

describe('LoadTestStationsSuccess', () => {
  it('should have the correct action type & test stations payload when LoadTestStationsSuccess() action is instantiated', () => {
    const actionInstance = new LoadTestStationsSuccess({} as TestStation[]);
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadTestStationsSuccess,
      testStations: {} as TestStation[]
    });
  });
});
