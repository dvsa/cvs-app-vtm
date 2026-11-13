import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
	TEST_TYPES_GROUP1,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2,
	TEST_TYPES_GROUP7,
	TEST_TYPES_GROUP9_10,
	TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
	TEST_TYPES_GROUP12_14,
} from '../../models/testTypeId.enum';
import { FeatureFlags } from '../../store/feature-flags/feature-flags.feature';
import { selectFeatureFlags } from '../../store/feature-flags/feature-flags.selectors';

export { FeatureFlags } from '../../store/feature-flags/feature-flags.feature';

@Injectable({
	providedIn: 'root',
})
export class FeatureToggleService {
	store = inject(Store);
	featureFlags = this.store.selectSignal(selectFeatureFlags);

	isFeatureEnabled(...keys: FeatureFlags[]): boolean {
		const featureFlags = this.featureFlags();
		if (!featureFlags) return false;
		return keys.some((key) => featureFlags[key]?.enabled === true);
	}

	shouldUseV2TestResults(testTypeId?: string): boolean {
		if (!testTypeId) return false;
		const allowList = [
			...TEST_TYPES_GROUP12_14,
			...TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
			...TEST_TYPES_GROUP9_10,
			...TEST_TYPES_GROUP1,
			...TEST_TYPES_GROUP2,
			...TEST_TYPES_GROUP7,
			...TEST_TYPES_GROUP1_SPEC_TEST,
		];

		return this.isFeatureEnabled(FeatureFlags.TEST_RESULT_CREATE) && allowList.includes(testTypeId || '');
	}
}
