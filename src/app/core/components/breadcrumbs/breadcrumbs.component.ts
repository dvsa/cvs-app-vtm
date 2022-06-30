import { Component, OnInit } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { RouterService } from '@services/router/router.service';
import { distinctUntilChanged, map, take } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  constructor(private routerService: RouterService) {}

  get breadcrumbs$() {
    return this.routerService.router$.pipe(
      map((router) => {
        let currentRoute = router?.state?.root;
        let breadcrumbs: Array<{ label: string; path: string }> = [];

        while (currentRoute?.firstChild) {
          const { routeConfig, data, url } = currentRoute.firstChild;

          if (data.hasOwnProperty('title') && routeConfig?.path) {
            breadcrumbs.push({ label: data['title'], path: url.map((url) => url.path).join('/') });
          }

          currentRoute = currentRoute.firstChild;
        }
        return breadcrumbs;
      })
    );
  }
}
