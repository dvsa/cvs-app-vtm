import {
  referenceDataLoadingState,
  selectAllReferenceDataByResourceType,
  selectReasonsForAbandoning,
  selectReferenceDataByResourceKey
} from './reference-data.selectors';
import { ReferenceDataState, initialReferenceDataState } from '../reducers/reference-data.reducer';
import { ReasonsForAbandoning, ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { Dictionary } from '@ngrx/entity';
import { testCases } from '../reference-data.test-cases';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

describe('Reference Data Selectors', () => {
  describe('selectAllReferenceDataByResourceType', () => {
    it.each(testCases)('should return all of the reference data for given resource type', value => {
      const { resourceType, payload } = value;
      const ids: string[] = payload.map(v => v.resourceKey);
      const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
        (acc, v) => ({ ...acc, [v.resourceKey]: v }),
        {} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
      );
      const state: ReferenceDataState = { ...initialReferenceDataState, [resourceType]: { ids, entities } };

      const expectedState = selectAllReferenceDataByResourceType(resourceType).projector(state[resourceType]);
      expect(expectedState).toHaveLength(mockCountriesOfRegistration.length);
      expect(expectedState).toEqual(payload);
    });
  });

  describe('selectReferenceDataByResourceKey', () => {
    it.each(testCases)('should return one specific reference data by type and key', value => {
      const { resourceType, payload } = value;
      const ids: string[] = payload.map(v => v.resourceKey);
      const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
        (acc, v) => ({ ...acc, [v.resourceKey]: v }),
        {} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
      );
      const state: ReferenceDataState = { ...initialReferenceDataState, COUNTRY_OF_REGISTRATION: { ids, entities } };

      const key = ids[Math.floor(Math.random() * ids.length)]; // select a random key

      const expectedState = selectReferenceDataByResourceKey(resourceType, key).projector(state);
      expect(expectedState).toBe(mockCountriesOfRegistration.find(r => r.resourceKey === key));
    });
  });

  it('should return loading state', () => {
    const state: ReferenceDataState = { ...initialReferenceDataState, loading: true };
    const selectedState = referenceDataLoadingState.projector(state);
    expect(selectedState).toEqual(state.loading);
  });

  it('should return the reasons for abandoning for the right vehicle', () => {
    const ReasonsForAbandoning: ReasonsForAbandoning[] = [
      {
        resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
        resourceKey: '123',
        vehicleType: VehicleTypes.PSV,
        description: 'foo'
      },
      {
        resourceType: ReferenceDataResourceType.ReasonsForAbandoning,
        resourceKey: '456',
        vehicleType: VehicleTypes.HGV,
        description: 'foo'
      }
    ];

    const selectedState = selectReasonsForAbandoning.projector(ReasonsForAbandoning, { vehicleType: VehicleTypes.PSV });

    expect(selectedState).toEqual([ReasonsForAbandoning[0]]);
  });
});
