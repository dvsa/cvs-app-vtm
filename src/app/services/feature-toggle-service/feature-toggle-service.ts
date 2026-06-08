import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { get } from 'lodash';
import { TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '../../models/testTypeId.enum';
import { selectFeatureFlags } from '../../store/feature-flags/feature-flags.selectors';

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

	shouldUseV2TestResults(testTypeId?: string) {
		if (!testTypeId) return false;
		if (!this.isFeatureEnabled('testresultcreate')) return false;
		const allowList = [...TEST_TYPES_GROUP9_10_CENTRAL_DOCS];
		return allowList.includes(testTypeId);
	}
}
