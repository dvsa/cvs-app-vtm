import * as referenceDataSelectors from './reference-data.selectors';
import { ReferenceDataState, initialReferenceDataState } from '../reducers/reference-data.reducer';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { Dictionary } from '@ngrx/entity';
import { testCases } from '../reference-data.test-cases';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

describe('Reference Data Selectors', () => {
  describe('selectAllReferenceDataByResourceType', () => {
    it.each(testCases)('should return all of the reference data for given resource type', value => {
      const { resourceType, payload } = value;
      const ids = payload.map(v => v.resourceKey);
      const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
        (acc, v) => ({ ...acc, [v.resourceKey]: v }),
        {} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
      );
      const state: ReferenceDataState = { ...initialReferenceDataState, [resourceType]: { ids, entities } };

      const expectedState = referenceDataSelectors.selectAllReferenceDataByResourceType(resourceType).projector(state[resourceType]);
      expect(expectedState).toHaveLength(mockCountriesOfRegistration.length);
      expect(expectedState).toEqual(payload);
    });
  });

  describe('selectReferenceDataByResourceKey', () => {
    it.each(testCases)('should return one specific reference data by type and key', value => {
      const { resourceType, payload } = value;
      const ids: string[] = payload.map(v => v.resourceKey as string);
      const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
        (acc, v) => ({ ...acc, [v.resourceKey]: v }),
        {} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
      );
      const state: ReferenceDataState = { ...initialReferenceDataState, COUNTRY_OF_REGISTRATION: { ids, entities, loading: false } };

      const key = ids[Math.floor(Math.random() * ids.length)]; // select a random key

      const expectedState = referenceDataSelectors.selectReferenceDataByResourceKey(resourceType, key).projector(state);
      expect(expectedState).toBe(mockCountriesOfRegistration.find(r => r.resourceKey === key));
    });
  });

  it('should return true if any feature is loading state', () => {
    const state: ReferenceDataState = { ...initialReferenceDataState };
    state.BODY_MAKE.loading = true;
    const selectedState = referenceDataSelectors.referenceDataLoadingState.projector(state);
    expect(selectedState).toEqual(true);
  });

  it('should return the reasons for abandoning for the right vehicle type', () => {
    const selectorSpy = jest.spyOn(referenceDataSelectors, 'selectAllReferenceDataByResourceType');
    referenceDataSelectors.selectReasonsForAbandoning(VehicleTypes.PSV);
    expect(selectorSpy).toHaveBeenLastCalledWith(ReferenceDataResourceType.ReasonsForAbandoningPsv);
    referenceDataSelectors.selectReasonsForAbandoning(VehicleTypes.HGV);
    expect(selectorSpy).toHaveBeenLastCalledWith(ReferenceDataResourceType.ReasonsForAbandoningHgv);
    referenceDataSelectors.selectReasonsForAbandoning(VehicleTypes.TRL);
    expect(selectorSpy).toHaveBeenLastCalledWith(ReferenceDataResourceType.ReasonsForAbandoningTrl);
  });
});
