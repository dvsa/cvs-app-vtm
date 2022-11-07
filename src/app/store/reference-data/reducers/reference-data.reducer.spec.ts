import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Dictionary } from '@ngrx/entity';
import {
  fetchReferenceData,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeyFailed,
  fetchReferenceDataByKeySuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataSuccess
} from '../actions/reference-data.actions';
import { testCases } from '../reference-data.test-cases';
import { initialReferenceDataState, referenceDataReducer, ReferenceDataState } from './reference-data.reducer';

describe('Reference Data Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };
      const state = referenceDataReducer(initialReferenceDataState, action);

      expect(state).toBe(initialReferenceDataState);
    });
  });

  describe('fetchReferenceData', () => {
    it('should set loading to true', () => {
      const newState: ReferenceDataState = { ...initialReferenceDataState, loading: true };
      const action = fetchReferenceData({ resourceType: ReferenceDataResourceType.CountryOfRegistration });
      const state = referenceDataReducer(initialReferenceDataState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('fetchReferenceDataSuccess', () => {
    it.each(testCases)('should set all reference data on success', value => {
      const { resourceType, payload } = value;
      const ids = payload.map(v => v.resourceKey);
      const entities: Dictionary<ReferenceDataModelBase> = payload.reduce(
        (acc, v) => ({ ...acc, [v.resourceKey]: v }),
        {} as { [V in ReferenceDataModelBase as V['resourceKey']]: V }
      );
      const newState: ReferenceDataState = {
        ...initialReferenceDataState,
        [resourceType]: { ids, entities }
      };
      const action = fetchReferenceDataSuccess({ resourceType, payload: [...payload] });
      const state = referenceDataReducer(initialReferenceDataState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('fetchReferenceDataFailed', () => {
    it('should set error state', () => {
      const newState = { ...initialReferenceDataState, loading: false };
      const action = fetchReferenceDataFailed({ error: 'unit testing error message' });
      const state = referenceDataReducer({ ...initialReferenceDataState, loading: true }, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('fetchReferenceDataByKey actions', () => {
    it('should set loading to true', () => {
      const newState: ReferenceDataState = { ...initialReferenceDataState, loading: true };
      const action = fetchReferenceDataByKey({
        resourceType: ReferenceDataResourceType.CountryOfRegistration,
        resourceKey: mockCountriesOfRegistration[0].resourceKey
      });
      const state = referenceDataReducer(initialReferenceDataState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });

    describe('fetchReferenceDataByKeySuccess', () => {
      it.each(testCases)('should set the the resource data item based on the type and key', value => {
        const { resourceType, resourceKey, payload } = value;
        const entity = payload.find(p => p.resourceKey === resourceKey)!;
        const ids = [resourceKey];
        const entities: Dictionary<ReferenceDataModelBase> = { [resourceKey]: entity };
        const newState: ReferenceDataState = {
          ...initialReferenceDataState,
          [resourceType]: { ids, entities }
        };

        const action = fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: entity });
        const state = referenceDataReducer(initialReferenceDataState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });

    describe('fetchReferenceDataByKeyFailed', () => {
      it('should set error state', () => {
        const newState = { ...initialReferenceDataState, loading: false };
        const action = fetchReferenceDataByKeyFailed({ error: 'unit testing error message by key' });
        const state = referenceDataReducer({ ...initialReferenceDataState, loading: true }, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });
  });
});
