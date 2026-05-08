import { createFeatureSelector } from '@ngrx/store';
import { STORE_FEATURE_FLAGS_KEY } from './feature-flags.feature';
import { FeatureFlagsState } from './feature-flags.reducer';

export const selectFeatureFlags = createFeatureSelector<FeatureFlagsState>(STORE_FEATURE_FLAGS_KEY);
