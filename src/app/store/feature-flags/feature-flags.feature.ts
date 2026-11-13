export const STORE_FEATURE_FLAGS_KEY = 'featureFlags';

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
	TEST_FACILITY = 'test-facility',
	TEST_FACILITY_AS_OBJECT = 'test-facility-as-object',
	TEST_RESULT_REFACTOR = 'test-result-refactor',
}

export function isFeatureFlag(value: unknown): value is FeatureFlags {
	return typeof value === 'string' && Object.values(FeatureFlags).some((flag) => flag === value);
}

type EnabledFeatureConfig = { enabled: boolean };
type VariantFeatureConfig = EnabledFeatureConfig & { _variant?: string };

export type TestResultRefactorFeatureConfig = EnabledFeatureConfig & {
	testTypesDeskBasedGroup1: boolean;
	testTypesDeskBasedGroup2: boolean;
	testTypesDeskBasedGroup3: boolean;
	testTypesDeskBasedGroup4: boolean;
	testTypesDeskBasedGroup5: boolean;
	testTypesGroup1: boolean;
	testTypesGroup12And14: boolean;
	testTypesGroup15And16: boolean;
	testTypesGroup2: boolean;
	testTypesGroup3And4And8: boolean;
	testTypesGroup5And13: boolean;
	testTypesGroup6And11: boolean;
	testTypesGroup7: boolean;
	testTypesGroup8Notifiable: boolean;
	testTypesGroup9And10: boolean;
	testTypesGroup9And10CentralDocs: boolean;
	testTypesSpecialistGroup1: boolean;
	testTypesSpecialistGroup1OldIVAorMSVA: boolean;
	testTypesSpecialistGroup2: boolean;
	testTypesSpecialistGroup3: boolean;
	testTypesSpecialistGroup4: boolean;
	testTypesSpecialistGroup5: boolean;
	testTypesSpecialistGroup5OldIVAorMSVA: boolean;
};

export type FeatureConfig = {
	[FeatureFlags.BETAS]?: EnabledFeatureConfig;
	[FeatureFlags.TECH_RECORD_REDESIGN]?: EnabledFeatureConfig;
	[FeatureFlags.TECH_RECORD_REDESIGN_CREATE]?: EnabledFeatureConfig;
	[FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS]?: VariantFeatureConfig;
	[FeatureFlags.TEST_RESULT_CREATE]?: EnabledFeatureConfig;
	[FeatureFlags.TEST_RESULT_AMEND]?: EnabledFeatureConfig;
	[FeatureFlags.HIDE_TEST_RESTRICTIONS]?: EnabledFeatureConfig;
	[FeatureFlags.ADAS_IMAGES_ON_DEFECTS]?: EnabledFeatureConfig;
	[FeatureFlags.BATCH_REDESIGN]?: VariantFeatureConfig;
	[FeatureFlags.TEST_FACILITY]?: EnabledFeatureConfig & { activities: string[] };
	[FeatureFlags.TEST_FACILITY_AS_OBJECT]?: EnabledFeatureConfig & { activities: string };
	[FeatureFlags.TEST_RESULT_REFACTOR]?: TestResultRefactorFeatureConfig;
};

export type FeatureConfigChanges = {
	[K in FeatureFlags]?: Pick<NonNullable<FeatureConfig[K]>, 'enabled'> &
		Partial<Omit<NonNullable<FeatureConfig[K]>, 'enabled'>>;
};
