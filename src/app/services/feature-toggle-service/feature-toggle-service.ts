import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { get } from 'lodash';
import { selectFeatureFlags } from '../../store/feature-flags/feature-flags.selectors';

export interface FeatureConfig {
	[key: string]: { enabled: boolean };
}

@Injectable({
	providedIn: 'root',
})
export class FeatureToggleService {
	store = inject(Store);
	featureFlags = this.store.selectSignal(selectFeatureFlags);

	isFeatureEnabled(...keys: string[]) {
		const featureFlags = this.featureFlags();
		if (!featureFlags) return false;
		return keys?.some((key) => get(featureFlags, key)?.enabled);
	}
}
