import { createReducer, on } from '@ngrx/store';
import { fetchFeatureFlagsSuccess, updateFeatureFlags } from './feature-flags.actions';
import { FeatureConfig, FeatureFlags } from './feature-flags.feature';

export type FeatureFlagsState = FeatureConfig | null;

export const initialFeatureFlagsState = null as FeatureFlagsState;

export const featureFlagsReducer = createReducer(
	initialFeatureFlagsState,
	on(fetchFeatureFlagsSuccess, (_, { config }) => config),
	on(updateFeatureFlags, (state, { changes }) => {
		const updatedState: FeatureConfig = { ...state };
		for (const key of Object.values(FeatureFlags)) {
			const change = changes[key];
			if (change) {
				Object.assign(updatedState, { [key]: { ...updatedState[key], ...change } });
			}
		}
		return updatedState;
	})
);
