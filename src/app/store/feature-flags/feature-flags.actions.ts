import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FeatureConfig, STORE_FEATURE_FLAGS_KEY } from './feature-flags.feature';

export const {
	fetchFeatureFlags,
	fetchLocalFeatureFlags,
	fetchRemoteFeatureFlags,
	fetchFeatureFlagsSuccess,
	fetchFeatureFlagsFailure,
	updateFeatureFlags,
} = createActionGroup({
	source: STORE_FEATURE_FLAGS_KEY,
	events: {
		fetchFeatureFlags: props<{ local: boolean }>(),
		fetchLocalFeatureFlags: emptyProps(),
		fetchRemoteFeatureFlags: emptyProps(),
		fetchFeatureFlagsSuccess: props<{ config: FeatureConfig }>(),
		fetchFeatureFlagsFailure: props<{ error: Error }>(),
		updateFeatureFlags: props<{ changes: Partial<FeatureConfig> }>(),
	},
});
