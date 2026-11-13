import { initialAppState } from '@/src/app/store';
import { TestResultRefactorFeatureConfig } from '@/src/app/store/feature-flags/feature-flags.feature';
import { selectFeatureFlags } from '@/src/app/store/feature-flags/feature-flags.selectors';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureFlags, FeatureToggleService } from '../feature-toggle-service';

describe('feature toggle service', () => {
	let service: FeatureToggleService;
	let store: MockStore;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [FeatureToggleService, provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);
		service = TestBed.inject(FeatureToggleService);
	});

	it('should create the user service', () => {
		expect(service).toBeTruthy();
	});

	describe('isFeatureEnabled', () => {
		it('should return false if there is no config', () => {
			store.overrideSelector(selectFeatureFlags, null);
			const result = service.isFeatureEnabled(FeatureFlags.BETAS);
			expect(result).toBeFalsy();
		});
		it('should return false if the flag is not in the config', () => {
			store.overrideSelector(selectFeatureFlags, {
				[FeatureFlags.TECH_RECORD_REDESIGN]: { enabled: false },
			});
			const result = service.isFeatureEnabled(FeatureFlags.BETAS);
			expect(result).toBeFalsy();
		});
		it('should return false if the key is in the config but is set to false', () => {
			store.overrideSelector(selectFeatureFlags, {
				[FeatureFlags.TECH_RECORD_REDESIGN]: { enabled: false },
				[FeatureFlags.BETAS]: { enabled: false },
			});
			const result = service.isFeatureEnabled(FeatureFlags.BETAS);
			expect(result).toBeFalsy();
		});
		it('should return true if the key is in the config but is set to false so should be hidden', () => {
			store.overrideSelector(selectFeatureFlags, {
				[FeatureFlags.TECH_RECORD_REDESIGN]: { enabled: false },
				[FeatureFlags.BETAS]: { enabled: true },
			});
			const result = service.isFeatureEnabled(FeatureFlags.BETAS);
			expect(result).toBeTruthy();
		});
	});

	describe('shouldUseV2TestResults', () => {
		const noGroups: TestResultRefactorFeatureConfig = {
			enabled: true,
			testTypesDeskBasedGroup1: false,
			testTypesDeskBasedGroup2: false,
			testTypesDeskBasedGroup3: false,
			testTypesDeskBasedGroup4: false,
			testTypesDeskBasedGroup5: false,
			testTypesGroup1: false,
			testTypesGroup12And14: false,
			testTypesGroup15And16: false,
			testTypesGroup2: false,
			testTypesGroup3And4And8: false,
			testTypesGroup5And13: false,
			testTypesGroup6And11: false,
			testTypesGroup7: false,
			testTypesGroup8Notifiable: false,
			testTypesGroup9And10: false,
			testTypesGroup9And10CentralDocs: false,
			testTypesSpecialistGroup1: false,
			testTypesSpecialistGroup1OldIVAorMSVA: false,
			testTypesSpecialistGroup2: false,
			testTypesSpecialistGroup3: false,
			testTypesSpecialistGroup4: false,
			testTypesSpecialistGroup5: false,
			testTypesSpecialistGroup5OldIVAorMSVA: false,
		};

		it.each([
			['testTypesDeskBasedGroup1', '417'],
			['testTypesDeskBasedGroup2', '403'],
			['testTypesDeskBasedGroup3', '407'],
			['testTypesDeskBasedGroup4', '409'],
			['testTypesDeskBasedGroup5', '439'],
			['testTypesGroup1', '1'],
			['testTypesGroup12And14', '117'],
			['testTypesGroup15And16', '39'],
			['testTypesGroup2', '15'],
			['testTypesGroup3And4And8', '38'],
			['testTypesGroup5And13', '56'],
			['testTypesGroup6And11', '62'],
			['testTypesGroup7', '59'],
			['testTypesGroup8Notifiable', '47'],
			['testTypesGroup9And10', '76'],
			['testTypesGroup9And10CentralDocs', '41'],
			['testTypesSpecialistGroup1', '125'],
			['testTypesSpecialistGroup1OldIVAorMSVA', '125'],
			['testTypesSpecialistGroup2', '142'],
			['testTypesSpecialistGroup3', '143'],
			['testTypesSpecialistGroup4', '147'],
			['testTypesSpecialistGroup5', '153'],
			['testTypesSpecialistGroup5OldIVAorMSVA', '153'],
		] as const)('uses the %s setting for test type %s', (group, testTypeId) => {
			const selector = store.overrideSelector(selectFeatureFlags, {
				[FeatureFlags.TEST_RESULT_CREATE]: { enabled: false },
				[FeatureFlags.TEST_RESULT_AMEND]: { enabled: false },
				[FeatureFlags.TEST_RESULT_REFACTOR]: noGroups,
			});
			expect(service.shouldUseV2TestResults(testTypeId)).toBe(false);

			selector.setResult({
				[FeatureFlags.TEST_RESULT_REFACTOR]: { ...noGroups, [group]: true },
			});
			store.refreshState();
			expect(service.shouldUseV2TestResults(testTypeId)).toBe(true);
		});

		it('uses the union of enabled groups, including overlapping specialist groups', () => {
			store.overrideSelector(selectFeatureFlags, {
				[FeatureFlags.TEST_RESULT_REFACTOR]: {
					...noGroups,
					testTypesSpecialistGroup1OldIVAorMSVA: true,
					testTypesGroup2: true,
				},
			});
			expect(service.shouldUseV2TestResults('125')).toBe(true);
			expect(service.shouldUseV2TestResults('15')).toBe(true);
			expect(service.shouldUseV2TestResults('1')).toBe(false);
			expect(service.shouldUseV2TestResults('unknown')).toBe(false);
			expect(service.shouldUseV2TestResults()).toBe(false);
		});

		it('does not use v2 when the parent flag is disabled or missing', () => {
			const selector = store.overrideSelector(selectFeatureFlags, {
				[FeatureFlags.TEST_RESULT_CREATE]: { enabled: true },
				[FeatureFlags.TEST_RESULT_AMEND]: { enabled: true },
				[FeatureFlags.TEST_RESULT_REFACTOR]: { ...noGroups, enabled: false, testTypesGroup1: true },
			});
			expect(service.shouldUseV2TestResults('1')).toBe(false);
			selector.setResult({ [FeatureFlags.TEST_RESULT_CREATE]: { enabled: true } });
			store.refreshState();
			expect(service.shouldUseV2TestResults('1')).toBe(false);
		});
	});
});
