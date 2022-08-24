import { Component } from '@angular/core';
import { RouterService } from '@services/router/router.service';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  constructor(private routerService: RouterService) {}

  get breadcrumbs$() {
    return this.routerService.router$.pipe(
      distinctUntilChanged(),
      map(router => {
        let currentRoute = router?.state?.root;
        let breadcrumbs: Array<{ label: string; path: string }> = [];

        while (currentRoute?.firstChild) {
          const { routeConfig, data, url } = currentRoute.firstChild;

          if (data.hasOwnProperty('title') && routeConfig?.path) {
            breadcrumbs.push({
              label: data['title'],
              path: [...breadcrumbs.map(breadcrumb => breadcrumb.path), ...url.map(url => url.path)].join('/')
            });
          }

          currentRoute = currentRoute.firstChild;
        }
        return breadcrumbs;
      })
    );
  }

  trackByFn(index: number, breadcrumb: { label: string; path: string }) {
    return breadcrumb.path || index;
  }
}
