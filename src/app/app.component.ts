// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="govuk.d.ts">
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { selectRouteData } from '@store/router/selectors/router.selectors';
import { initAll } from 'govuk-frontend/govuk/all';
import {
  take, map, Subject, takeUntil,
} from 'rxjs';
import { GoogleAnalyticsService } from '@services/google-analytics/google-analytics.service';
import * as Sentry from '@sentry/angular-ivy';
import { State } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public userService: UserService,
    private loadingService: LoadingService,
    private router: Router,
    private store: Store<State>,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.pageView(document.title, event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.startSentry();
    initAll();
    this.throwError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isStandardLayout() {
    return this.store.pipe(
      take(1),
      select(selectRouteData),
      map((routeData) => routeData && !routeData['isCustomLayout']),
    );
  }

  get loading() {
    return this.loadingService.showSpinner$;
  }

  startSentry() {
    Sentry.init({
      dsn: 'https://3d918c477756e028e3ca92bb285de60b@o444637.ingest.sentry.io/4506179953885184',
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.routingInstrumentation,
        }),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: ['localhost'],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
  throwError() {
    throw new Error('Sentry Test Error');
  }
}
