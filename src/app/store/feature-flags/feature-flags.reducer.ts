import { createReducer, on } from '@ngrx/store';
import { fetchFeatureFlagsSuccess, updateFeatureFlags } from './feature-flags.actions';
import { FeatureConfig } from './feature-flags.feature';

export type FeatureFlagsState = FeatureConfig | null;

export const initialFeatureFlagsState = null as FeatureFlagsState;

export const featureFlagsReducer = createReducer(
	initialFeatureFlagsState,
	on(fetchFeatureFlagsSuccess, (_, { config }) => config),
	on(updateFeatureFlags, (state, { changes }) => ({ ...state, ...changes }) as FeatureConfig)
);
