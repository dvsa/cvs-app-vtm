import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { FeatureToggleGuard } from './feature-toggle.guard';

describe('feature toggle guard', () => {
  let guard: FeatureToggleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        FeatureToggleGuard,
        { provide: FeatureToggleService, useValue: { isFeatureEnabled: () => true } },
      ],
    });

    guard = TestBed.inject(FeatureToggleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when the feature is enabled', () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { featureToggleName: 'testToggle' };

    jest.spyOn(TestBed.inject(FeatureToggleService), 'isFeatureEnabled').mockReturnValue(true);

    const guardResponse = guard.canActivate(next);

    expect(guardResponse).toBeTruthy();
  });

  it('should return false when the feature is disabled', () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { featureToggleName: 'testToggle' };

    jest.spyOn(TestBed.inject(FeatureToggleService), 'isFeatureEnabled').mockReturnValue(false);

    const guardResponse = guard.canActivate(next);

    expect(guardResponse).toBeFalsy();
  });

  it('should return false when no feature is given', () => {
    const next = new ActivatedRouteSnapshot();
    next.data = { };

    jest.spyOn(TestBed.inject(FeatureToggleService), 'isFeatureEnabled').mockReturnValue(true);

    const guardResponse = guard.canActivate(next);

    expect(guardResponse).toBeFalsy();
  });

});
