import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';

export const FeatureToggleGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  const featureToggleService = inject(FeatureToggleService);
  const feature = next.data['featureToggleName'];

  if (feature) {
    return featureToggleService.isFeatureEnabled(feature);
  }

  return false;
};
