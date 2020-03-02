import { selectFeature } from '@app/store/selectors/ReferenceData.selectors';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import { getPreparers, getTestStations } from '@app/store/selectors/ReferenceData.selectors';
import { initialReferenceDataState } from '@app/store/state/ReferenceDataState.state';

describe('vehicleTechRecordModel selectors', () => {
  const referenceData = {
    preparers: [{ preparerId: '1', preparerName: 'prep' } as Preparer],
    testStations: [{ testStationPNumber: '22', testStationType: 'test' } as TestStation]
  };

  it('should return the default state on initialization', () => {
    expect(selectFeature.projector(initialReferenceDataState)).toEqual({
      preparers: null,
      testStations: null
    });
  });

  it('should return preparers data from reference data', () => {
    expect(getPreparers.projector(referenceData)).toEqual(referenceData.preparers);
  });

  it('should return test stations data from reference data', () => {
    expect(getTestStations.projector(referenceData)).toEqual(referenceData.testStations);
  });
});
