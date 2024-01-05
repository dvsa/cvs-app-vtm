// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="govuk.d.ts">
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as Sentry from '@sentry/angular-ivy';
import { GoogleAnalyticsService } from '@services/google-analytics/google-analytics.service';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { selectRouteData } from '@store/router/selectors/router.selectors';
import { initAll } from 'govuk-frontend/govuk/all';
import {
  Subject,
  map,
  take,
  takeUntil,
} from 'rxjs';
import packageInfo from '../../package.json';
import { environment } from '../environments/environment';
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
    this.initGoogleTagManager();
    initAll();
  }

  initGoogleTagManager() {
    this.initialiseDataLayer();
    this.appendGTMScriptElement();
    this.appendGTMNoScriptElement();
  }

  appendGTMNoScriptElement() {
    const noScriptElement = document.createElement('noscript');
    const iFrameElement = document.createElement('iframe', { });

    iFrameElement.setAttribute('src', `https://www.googletagmanager.com/ns.html?id=${environment.VTM_GTM_CONTAINER_ID}`);
    iFrameElement.setAttribute('style', 'display: none; visibility: hidden');
    iFrameElement.setAttribute('height', '0');
    iFrameElement.setAttribute('width', '0');

    noScriptElement.appendChild(iFrameElement);
    document.body.appendChild(noScriptElement);
  }

  appendGTMScriptElement() {
    const scriptElement = document.createElement('script');
    scriptElement.async = true;
    scriptElement.src = `https://www.googletagmanager.com/gtm.js?id=${environment.VTM_GTM_CONTAINER_ID}`;
    document.head.appendChild(scriptElement);
  }

  initialiseDataLayer() {
    let { dataLayer } = (window as any);
    dataLayer = dataLayer || [];
    dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
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
      dsn: environment.SENTRY_DSN,
      environment: environment.production ? 'production' : 'development',
      release: packageInfo.version,
      replaysSessionSampleRate: 0.1,
      tracesSampleRate: 0.025,
      replaysOnErrorSampleRate: 1.0,
      enableTracing: false,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.routingInstrumentation,
        }),
        new Sentry.Replay(),
      ],
    });
  }
}
