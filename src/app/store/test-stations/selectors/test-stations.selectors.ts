import { TestStation } from '@models/test-stations/test-station.model';
import { createSelector } from '@ngrx/store';
import { testStationsAdapter, testStationsFeatureState } from '../reducers/test-stations.reducer';

const { selectAll } = testStationsAdapter.getSelectors();

export const testStations = createSelector(testStationsFeatureState, (state) => selectAll(state));

export const testStation = (id: string) => createSelector(testStationsFeatureState, (state) => state.entities[`${id}`]);

export const testStationsLoadingState = createSelector(testStationsFeatureState, (state) => state.loading);

export const getTestStationFromProperty = (property: keyof TestStation, value: string) =>
  createSelector(testStations, (stations) => stations.find((station) => station[`${property}`] === value));
