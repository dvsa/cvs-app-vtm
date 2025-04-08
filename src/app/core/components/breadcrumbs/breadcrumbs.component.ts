import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterService } from '@services/router/router.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
	selector: 'app-breadcrumbs',
	templateUrl: './breadcrumbs.component.html',
	styleUrls: ['./breadcrumbs.component.scss'],
	imports: [RouterLink, AsyncPipe],
})
export class BreadcrumbsComponent {
	constructor(private routerService: RouterService) {}

	get breadcrumbs$() {
		return this.routerService.router$.pipe(
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
	}
}
