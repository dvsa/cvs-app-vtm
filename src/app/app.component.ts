///<reference path="govuk.d.ts">
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { selectRouteData } from '@store/router/selectors/router.selectors';
import { initAll } from 'govuk-frontend/govuk/all';
import { take, map } from 'rxjs';
import { State } from './store';
import { GoogleAnalyticsService } from '@services/google-analytics/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public userService: UserService,
    private loadingService: LoadingService,
    private router: Router,
    private store: Store<State>,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.pageView(document.title, event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    initAll();
  }

  get isStandardLayout() {
    return this.store.pipe(
      take(1),
      select(selectRouteData),
      map(routeData => routeData && !routeData['isCustomLayout'])
    );
  }

  get loading() {
    return this.loadingService.showSpinner$;
  }
}
