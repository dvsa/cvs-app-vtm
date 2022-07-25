import { TestStation } from "@models/test-station.model";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchTestStation, fetchTestStationFailed, fetchTestStations, fetchTestStationsFailed, fetchTestStationsSuccess, fetchTestStationSuccess } from "../actions/test-stations.actions";

export interface TestStationsState extends EntityState<TestStation> {
  loading: boolean;
  error: string;
}

export const STORE_FEATURE_TEST_STATIONS_KEY = 'TestStations';

export const testStationsFeatureState = createFeatureSelector<TestStationsState>(STORE_FEATURE_TEST_STATIONS_KEY);

export const testStationsAdapter: EntityAdapter<TestStation> = createEntityAdapter<TestStation>({ selectId: testStation => testStation.testStationId });

export const testStationsReducer = createReducer(
  testStationsAdapter.getInitialState({ loading: false, error: '' }),

  on(fetchTestStations, state => ({ ...state, loading: true })),
  on(fetchTestStationsSuccess, (state, action) => ({ ...testStationsAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestStationsFailed, state => ({ ...testStationsAdapter.setAll([], state), loading: false })),

  on(fetchTestStation, state => ({ ...state, loading: true })),
  on(fetchTestStationSuccess, (state, action) => ({ ...testStationsAdapter.upsertOne(action.payload, state), loading: false })),
  on(fetchTestStationFailed, state => ({ ...testStationsAdapter.setAll([], state), loading: false })),
);
