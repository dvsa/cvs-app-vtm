import { initialAppState } from '@/src/app/store';
import { selectFeatureFlags } from '@/src/app/store/feature-flags/feature-flags.selectors';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureToggleService } from '../feature-toggle-service';

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
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeFalsy();
		});
		it('should return false if the key is not in the config', () => {
			store.overrideSelector(selectFeatureFlags, {
				randomKey: { enabled: false },
			});
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeFalsy();
		});
		it('should return false if the key is in the config but is set to false', () => {
			store.overrideSelector(selectFeatureFlags, {
				randomKey: { enabled: false },
				testToggle: { enabled: false },
			});
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeFalsy();
		});
		it('should return true if the key is in the config but is set to false so should be hidden', () => {
			store.overrideSelector(selectFeatureFlags, {
				randomKey: { enabled: false },
				testToggle: { enabled: true },
			});
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeTruthy();
		});
	});
});
