import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import {
  EReferenceDataActions,
  LoadPreparers,
  LoadPreparersSuccess,
  LoadTestStations,
  LoadTestStationsSuccess,
  LoadTestTypeCategoriesSuccess
} from '@app/store/actions/ReferenceData.actions';
import { TestTypeCategory } from '@app/models/test-type-category';

describe('LoadPreparers', () => {
  it('should create LoadPreparers action', () => {
    const actionInstance = new LoadPreparers();
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadPreparers
    });
  });
});

describe('LoadTestStations', () => {
  it('should create LoadTestStations action', () => {
    const actionInstance = new LoadTestStations();
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadTestStations
    });
  });
});

describe('LoadPreparersSuccess', () => {
  it('should create LoadPreparersSuccess action', () => {
    const actionInstance = new LoadPreparersSuccess({} as Preparer[]);
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadPreparersSuccess,
      preparers: {} as Preparer[]
    });
  });
});

describe('LoadTestStationsSuccess', () => {
  it('should create LoadTestStationsSuccess action', () => {
    const actionInstance = new LoadTestStationsSuccess({} as TestStation[]);
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadTestStationsSuccess,
      testStations: {} as TestStation[]
    });
  });
});

describe('LoadTestTypeCategoriesSuccess', () => {
  it('should create LoadTestTypeCategoriesSuccess action', () => {
    const actionInstance = new LoadTestTypeCategoriesSuccess({} as TestTypeCategory[]);
    expect({ ...actionInstance }).toEqual({
      type: EReferenceDataActions.LoadTestTypeCategoriesSuccess,
      testTypeCategories: {} as TestTypeCategory[]
    });
  });
});
