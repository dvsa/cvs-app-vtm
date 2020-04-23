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
  it('action should have correct type', () => {
    const actionInstance = new LoadPreparers();
    expect(actionInstance.type).toBe(EReferenceDataActions.LoadPreparers);
  });
});

describe('LoadTestStations', () => {
  it('action should have correct type & payload', () => {
    const actionInstance = new LoadTestStations();
    expect(actionInstance.type).toBe(EReferenceDataActions.LoadTestStations);
  });
});

describe('LoadPreparersSuccess', () => {
  it('action should have correct type & payload', () => {
    const actionInstance = new LoadPreparersSuccess({} as Preparer[]);
    expect(actionInstance.type).toBe(EReferenceDataActions.LoadPreparersSuccess);
  });
});

describe('LoadTestStationsSuccess', () => {
  it('action should have correct type & payload', () => {
    const actionInstance = new LoadTestStationsSuccess({} as TestStation[]);
    expect(actionInstance.type).toBe(EReferenceDataActions.LoadTestStationsSuccess);
  });
});
