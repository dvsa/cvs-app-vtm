import { TestStation } from '@models/test-stations/test-station.model';
import { initialTestStationsState, TestStationsState } from '../reducers/test-stations.reducer';
import { getTestStationFromProperty, testStation, testStations, testStationsLoadingState } from './test-stations.selectors';

describe('Test Results Selectors', () => {
  describe('adapter selectors', () => {
    it('should return correct state', () => {
      const state = { ...initialTestStationsState, ids: ['1'], entities: { ['1']: { preparerId: '2' } } } as unknown as TestStationsState;

      expect(testStations.projector(state)).toEqual([{ preparerId: '2' }]);
      expect(testStation('1').projector(state)).toEqual({ preparerId: '2' });
    });
  });

  describe('testStationsLoadingState', () => {
    it('should return loading state', () => {
      const state: TestStationsState = { ...initialTestStationsState, loading: true };
      const selectedState = testStationsLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });

  describe('getTestStationsFromProperty', () => {
    it('return a test station with a matching testStationName', () => {
      const testStations = [
        {
          testStationName: 'foo',
          testStationPNumber: '1234',
          testStationType: 'gvts'
        },
        {
          testStationName: 'bar',
          testStationPNumber: '356728',
          testStationType: 'atf'
        }
      ] as TestStation[];
      expect(getTestStationFromProperty('testStationName', 'foo').projector(testStations)).toEqual(testStations[0]);
    });
    it('return a test station with a matching PNumber', () => {
      const testStations = [
        {
          testStationName: 'foo',
          testStationPNumber: '1234',
          testStationType: 'gvts'
        },
        {
          testStationName: 'bar',
          testStationPNumber: '356728',
          testStationType: 'atf'
        }
      ] as TestStation[];
      expect(getTestStationFromProperty('testStationPNumber', '356728').projector(testStations)).toEqual(testStations[1]);
    });
  });
});
