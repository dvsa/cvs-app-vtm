import { HttpService } from '@/src/app/services/http/http.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FeatureToggleService } from '../feature-toggle-service';

describe('feature toggle service', () => {
	let service: FeatureToggleService;
	let httpService: HttpService;
	let httpClient: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [FeatureToggleService, provideHttpClient(), provideHttpClientTesting()],
		});

		httpService = TestBed.inject(HttpService);
		httpClient = TestBed.inject(HttpClient);
		TestBed.inject(HttpTestingController);
		service = TestBed.inject(FeatureToggleService);
	});

	it('should create the user service', () => {
		expect(service).toBeTruthy();
	});

	describe('loadConfig', () => {
		it('should create the config from a http request', async () => {
			const expectedConfig = {
				testToggle: { enabled: true },
			};

			// TODO: remove when we move away from local config
			jest.spyOn(httpClient, 'get').mockReturnValueOnce(of(expectedConfig));
			jest.spyOn(httpService, 'getFeatureFlags').mockReturnValueOnce(of(expectedConfig));

			await service.loadConfig();

			expect(service.config()).toBeTruthy();
			expect(service.config()).toEqual(expectedConfig);
		});
	});

	describe('isFeatureEnabled', () => {
		it('should return false if there is no config', () => {
			service.config.set(null);
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeFalsy();
		});
		it('should return false if the key is not in the config', () => {
			service.config.set({
				randomKey: { enabled: false },
			});
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeFalsy();
		});
		it('should return false if the key is in the config but is set to false', () => {
			service.config.set({
				randomKey: { enabled: false },
				testToggle: { enabled: false },
			});
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeFalsy();
		});
		it('should return true if the key is in the config but is set to false so should be hidden', () => {
			service.config.set({
				randomKey: { enabled: false },
				testToggle: { enabled: true },
			});
			const result = service.isFeatureEnabled('testToggle');
			expect(result).toBeTruthy();
		});
	});
});
