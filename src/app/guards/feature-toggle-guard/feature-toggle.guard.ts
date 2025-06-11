import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';

@Injectable({
	providedIn: 'root',
})
export class FeatureToggleGuard implements CanActivate {
	featureToggleService = inject(FeatureToggleService);

	canActivate(next: ActivatedRouteSnapshot): boolean {
		const feature = next.data['featureToggleName'];

		if (feature) {
			return this.featureToggleService.isFeatureEnabled(feature);
		}
		return false;
	}
}
