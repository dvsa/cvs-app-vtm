import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { get } from 'lodash';
import {
	TEST_TYPES_GROUP1,
	TEST_TYPES_GROUP2,
	TEST_TYPES_GROUP9_10,
	TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
} from '../../models/testTypeId.enum';
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

	shouldUseV2TestResults(testTypeId?: string): boolean {
		if (!testTypeId) return false;
		const allowList = [
			...TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
			...TEST_TYPES_GROUP9_10,
			...TEST_TYPES_GROUP1,
			...TEST_TYPES_GROUP2,
		];

		return this.isFeatureEnabled(FeatureFlags.TEST_RESULT_CREATE) && allowList.includes(testTypeId || '');
	}
}

export enum FeatureFlags {
	BETAS = 'betas',
	TECH_RECORD_REDESIGN = 'techrecordredesign',
	TECH_RECORD_REDESIGN_CREATE = 'techrecordredesigncreate',
	TECH_RECORD_REDESIGN_CREATE_DETAILS = 'techrecordredesigncreatedetails',
	TEST_RESULT_CREATE = 'testresultcreate',
	TEST_RESULT_AMEND = 'testresultamend',
	HIDE_TEST_RESTRICTIONS = 'hide-test-restriction-functionality',
	ADAS_IMAGES_ON_DEFECTS = 'adas-images-on-defects',
	BATCH_REDESIGN = 'batch-redesign',
}
