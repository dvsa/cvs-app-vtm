import { TestStationSchema } from '@dvsa/cvs-type-definitions/types/v1/test-station';
import { createSelector } from '@ngrx/store';
import { testStationsAdapter, testStationsFeatureState } from './test-stations.reducer';

const { selectAll } = testStationsAdapter.getSelectors();

export const testStations = createSelector(testStationsFeatureState, (state) => selectAll(state));

export const testStation = (id: string) => createSelector(testStationsFeatureState, (state) => state.entities[`${id}`]);

export const getTestStationFromProperty = (property: keyof TestStationSchema, value: string) =>
	createSelector(testStations, (stations) => stations.find((station) => station[`${property}`] === value));
