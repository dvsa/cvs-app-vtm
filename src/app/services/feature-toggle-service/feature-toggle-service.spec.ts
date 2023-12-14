import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { FeatureToggleService } from './feature-toggle-service';
import { environment } from '../../../environments/environment';

describe('feature toggle service', () => {
  let service: FeatureToggleService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Store, FeatureToggleService],
    });

    httpClient = TestBed.inject(HttpClient);
    TestBed.inject(HttpTestingController);
    service = TestBed.inject(FeatureToggleService);
  });

  it('should create the user service', () => {
    expect(service).toBeTruthy();
  });

  describe('loadConfig', () => {
    it('should create the config from a http request', async () => {
      service.configPath = 'test/path.json';

      const expectedConfig = {
        testToggle: 'true',
      };

      jest.spyOn(httpClient, 'get').mockReturnValueOnce(of(expectedConfig));

      await service.loadConfig();

      expect(service.config).toBeTruthy();
      expect(service.config).toEqual(expectedConfig);
    });
  });

  describe('getConfig', () => {
    it('should return the correct feature toggle config', () => {
      environment.isDevelop = true;
      expect(service.getConfig()).toBe('assets/featureToggle.json');

      environment.isDevelop = false;
      environment.isIntegration = true;
      expect(service.getConfig()).toBe('assets/featureToggle.int.json');

      environment.isIntegration = false;
      environment.isPreProd = true;
      expect(service.getConfig()).toBe('assets/featureToggle.preprod.json');
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return false if there is no config', () => {
      service.config = null;
      const result = service.isFeatureEnabled('testToggle');
      expect(result).toBeFalsy();
    });
    it('should return false if the key is not in the config', () => {
      service.config = {
        randomKey: false,
      };
      const result = service.isFeatureEnabled('testToggle');
      expect(result).toBeFalsy();
    });
    it('should return false if the key is in the config but is set to false', () => {
      service.config = {
        randomKey: false,
        testToggle: false,
      };
      const result = service.isFeatureEnabled('testToggle');
      expect(result).toBeFalsy();
    });
    it('should return true if the key is in the config but is set to false so should be hidden', () => {
      service.config = {
        randomKey: false,
        testToggle: true,
      };
      const result = service.isFeatureEnabled('testToggle');
      expect(result).toBeTruthy();
    });
  });
});
