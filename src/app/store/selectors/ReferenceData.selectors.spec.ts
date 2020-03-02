import { selectFeature } from '@app/store/selectors/ReferenceData.selectors';
import { IReferenceDataState } from '@app/store/state/ReferenceDataState.state';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import {getPreparers, getTestStations} from '@app/store/selectors/ReferenceData.selectors';

describe('vehicleTechRecordModel selectors', () => {
  const createState = ({
   referenceData = {
      preparers: {} as Preparer[],
      testStations: {} as TestStation[]
    }
  } = {}) => ({
    referenceData: {
      referenceData
    }
  });

  it('selectFeature', () => {
    const state = createState();
    expect(selectFeature(state)).toMatchObject(state.referenceData);
  });

  it('getPreparers', () => {
    const state = createState();
    expect(getPreparers(selectFeature(state))).toMatchObject({});
  });

  it('getTestStations', () => {
    const state = createState();
    expect(getTestStations(selectFeature(state))).toMatchObject({});
  });
});
