import { initialAppState } from '@/src/app/store';
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
});
