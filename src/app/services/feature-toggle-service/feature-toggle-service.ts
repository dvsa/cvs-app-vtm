import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TEST_TYPES } from '../../models/testTypeId.enum';
import { FeatureFlags, TestResultRefactorFeatureConfig } from '../../store/feature-flags/feature-flags.feature';
import { selectFeatureFlags } from '../../store/feature-flags/feature-flags.selectors';

export { FeatureFlags } from '../../store/feature-flags/feature-flags.feature';

const testTypeGroups: Record<Exclude<keyof TestResultRefactorFeatureConfig, 'enabled'>, readonly string[]> = TEST_TYPES;
const testTypeGroupKeys = Object.keys(testTypeGroups) as Array<keyof typeof testTypeGroups>;

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
		const refactor = this.featureFlags()?.[FeatureFlags.TEST_RESULT_REFACTOR];
		if (!testTypeId || !refactor?.enabled) return false;
		return testTypeGroupKeys.some((group) => refactor[group] === true && testTypeGroups[group].includes(testTypeId));
	}
}
