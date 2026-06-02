import { TestStationSchema } from '@dvsa/cvs-type-definitions/types/v1/test-station';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
	fetchTestStationFailed,
	fetchTestStationSuccess,
	fetchTestStationsFailed,
	fetchTestStationsSuccess,
} from './test-stations.actions';

interface Extras {
	error: string;
}

export interface TestStationsState extends EntityState<TestStationSchema>, Extras {}

export const STORE_FEATURE_TEST_STATIONS_KEY = 'testStations';

export const testStationsFeatureState = createFeatureSelector<TestStationsState>(STORE_FEATURE_TEST_STATIONS_KEY);

export const testStationsAdapter: EntityAdapter<TestStationSchema> = createEntityAdapter<TestStationSchema>({
	selectId: (testStation) => testStation.testStationId,
});

export const initialTestStationsState: EntityState<TestStationSchema> & Extras = testStationsAdapter.getInitialState({
	error: '',
});

export const testStationsReducer = createReducer(
	initialTestStationsState,
	on(fetchTestStationsSuccess, (state, action) => ({
		...testStationsAdapter.setAll(action.payload, state),
	})),
	on(fetchTestStationsFailed, (state) => ({ ...testStationsAdapter.setAll([], state) })),
	on(fetchTestStationSuccess, (state, action) => ({
		...testStationsAdapter.upsertOne(action.payload, state),
	})),
	on(fetchTestStationFailed, (state) => ({ ...testStationsAdapter.setAll([], state) }))
);
