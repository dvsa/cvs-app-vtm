import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { FeatureToggleGuard } from './feature-toggle.guard';

describe('FeatureToggleGuard', () => {
  let featureToggleService: FeatureToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: FeatureToggleService,
          useValue: {
            isFeatureEnabled: jest.fn(),
          },
        },
      ],
    });

    featureToggleService = TestBed.inject(FeatureToggleService);
  });

  it('should return true when the feature is enabled', () => {
    const mockRoute = {} as unknown as ActivatedRouteSnapshot;
    const mockRouteState = {} as unknown as RouterStateSnapshot;
    mockRoute.data = { featureToggleName: 'testToggle' };

    jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(true);

    TestBed.runInInjectionContext(() => expect(FeatureToggleGuard(mockRoute, mockRouteState)).toBe(true));
  });

  it('should return false when the feature is disabled', () => {
    const mockRoute = {} as unknown as ActivatedRouteSnapshot;
    const mockRouteState = {} as unknown as RouterStateSnapshot;
    mockRoute.data = { featureToggleName: 'testToggle' };

    jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(false);

    TestBed.runInInjectionContext(() => expect(FeatureToggleGuard(mockRoute, mockRouteState)).toBe(false));
  });

  it('should return false when no feature is given', () => {
    const mockRoute = {} as unknown as ActivatedRouteSnapshot;
    const mockRouteState = {} as unknown as RouterStateSnapshot;
    mockRoute.data = { };

    jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(false);

    TestBed.runInInjectionContext(() => expect(FeatureToggleGuard(mockRoute, mockRouteState)).toBe(false));
  });
});
