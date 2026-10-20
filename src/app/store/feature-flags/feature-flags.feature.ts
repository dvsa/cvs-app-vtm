export const STORE_FEATURE_FLAGS_KEY = 'featureFlags';

export type FeatureConfig = {
	[key: string]: { enabled: boolean };
};
