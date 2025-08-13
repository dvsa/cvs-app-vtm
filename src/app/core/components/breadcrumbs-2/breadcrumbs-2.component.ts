import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { AsyncPipe, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterService } from '@services/router/router.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
	selector: 'app-breadcrumbs-2',
	templateUrl: './breadcrumbs-2.component.html',
	styleUrls: ['./breadcrumbs-2.component.scss'],
	imports: [RouterLink, AsyncPipe],
})
export class Breadcrumbs2Component {
	routerService = inject(RouterService);
	location = inject(Location);
	featureToggleService = inject(FeatureToggleService);
	showBackButton = false;

	breadcrumbs$ = this.routerService.router$.pipe(
		distinctUntilChanged(),
		map((router) => {
			let currentRoute = router?.state?.root;
			const breadcrumbs: Array<{ label: string; path: string; preserveQueryParams: boolean }> = [];

			while (currentRoute?.firstChild) {
				const { routeConfig, data, url } = currentRoute.firstChild;
				const title = data['title'];
				this.showBackButton = this.shouldShowBackButton(title);

				if (data['title'] && routeConfig?.path && !breadcrumbs.some((b) => b.label === data['title'])) {
					// standard breadcrumb logic
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

	private shouldShowBackButton(title: string) {
		switch (title) {
			case 'Duplicate VIN found':
			case 'Create new technical record':
				return this.featureToggleService.isFeatureEnabled('TechRecordRedesignCreate');
			case 'New record details':
			case 'Are you sure you want to cancel creating this record?':
				return this.featureToggleService.isFeatureEnabled('TechRecordRedesignCreateDetails');
			default:
				return false;
		}
	}
}
