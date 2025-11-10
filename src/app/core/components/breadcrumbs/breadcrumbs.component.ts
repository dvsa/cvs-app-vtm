import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterService } from '@services/router/router.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
	selector: 'app-breadcrumbs',
	templateUrl: './breadcrumbs.component.html',
	styleUrls: ['./breadcrumbs.component.scss'],
	imports: [RouterLink, AsyncPipe, JsonPipe],
})
export class BreadcrumbsComponent {
	routerService = inject(RouterService);
	featureToggleService = inject(FeatureToggleService);

	breadcrumbs$ = this.routerService.router$.pipe(
		distinctUntilChanged(),
		map((router) => {
			let currentRoute = router?.state?.root;
			const breadcrumbs: Array<{ label: string; path: string; preserveQueryParams: boolean }> = [];

			while (currentRoute?.firstChild) {
				const { routeConfig, data, url } = currentRoute.firstChild;

				if (data['title'] && routeConfig?.path && !breadcrumbs.some((b) => b.label === data['title'])) {
					breadcrumbs.push({
						label: data['title'],
						path: [...breadcrumbs.slice(-1).map((b) => b.path), ...url.map((urlValue) => urlValue.path)].join('/'),
						preserveQueryParams: !!data['breadcrumbPreserveQueryParams'],
					});
				}

				currentRoute = currentRoute.firstChild;
			}

			return breadcrumbs;
		})
	);

	backlink$ = this.routerService.router$.pipe(
		distinctUntilChanged(),
		map((router) => {
			let currentRoute = router?.state?.root;
			while (currentRoute?.firstChild) {
				const { data } = currentRoute.firstChild;
				if ('backlink' in data) {
					const config = data['backlink'];
					// If we provide a feature flags list, then only show the backlink if the feature flag is enabled
					if ('featureFlags' in config && !this.featureToggleService.isFeatureEnabled(...config['featureFlags'])) {
						return null;
					}

					return config.url;
				}

				currentRoute = currentRoute.firstChild;
			}

			return null;
		})
	);
}
