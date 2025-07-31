import { AsyncPipe } from '@angular/common';
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
	showBackButton = false;

	breadcrumbs$ = this.routerService.router$.pipe(
		distinctUntilChanged(),
		map((router) => {
			let currentRoute = router?.state?.root;
			const breadcrumbs: Array<{ label: string; path: string; preserveQueryParams: boolean }> = [];

			while (currentRoute?.firstChild) {
				const { routeConfig, data, url } = currentRoute.firstChild;
				const title = data['title'];
				const hardCodedBackButtonRoutes = ['Create new technical record'];
				this.showBackButton = hardCodedBackButtonRoutes.includes(title);

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
}
