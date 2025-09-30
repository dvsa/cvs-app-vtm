import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { AxlesService } from '../axles.service';

describe('AxlesService', () => {
	let service: AxlesService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [FeatureToggleService, provideHttpClient(), provideHttpClientTesting()],
		});
		service = TestBed.inject(AxlesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
