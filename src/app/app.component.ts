import { AsyncPipe, NgClass } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="govuk.d.ts">
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as Sentry from '@sentry/angular';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { startSendingLogs } from '@store/logs/logs.actions';
import { selectRouteData } from '@store/router/router.selectors';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { initAll } from 'govuk-frontend/govuk/all';
import { Subject, map, take, takeUntil } from 'rxjs';
import packageInfo from '../../package.json';
import { environment } from '../environments/environment';
import { BreadcrumbsComponent } from './core/components/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { GlobalErrorComponent } from './core/components/global-error/global-error.component';
import { GlobalWarningComponent } from './core/components/global-warning/global-warning.component';
import { HeaderComponent } from './core/components/header/header.component';
import { PhaseBannerComponent } from './core/components/phase-banner/phase-banner.component';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { State } from './store';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['app.component.scss'],
	imports: [
		HeaderComponent,
		PhaseBannerComponent,
		NgClass,
		BreadcrumbsComponent,
		GlobalErrorComponent,
		GlobalWarningComponent,
		SpinnerComponent,
		RouterOutlet,
		FooterComponent,
		AsyncPipe,
	],
})
export class AppComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();
	protected readonly version = packageInfo.version;

	constructor(
		public userService: UserService,
		private loadingService: LoadingService,
		private router: Router,
		private gtmService: GoogleTagManagerService,
		private store: Store<State>,
		private analyticsService: AnalyticsService
	) {}

	async ngOnInit() {
		this.startSentry();

		this.store.dispatch(startSendingLogs());

		this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
			if (event instanceof NavigationEnd) {
				const gtmTag = {
					event: document.title,
					pageName: event.urlAfterRedirects,
				};
				void this.gtmService.pushTag(gtmTag);
			}
		});

		await this.gtmService.addGtmToDom();
		this.analyticsService.pushToDataLayer({ AppVersionDataLayer: packageInfo.version });
		await this.analyticsService.setUserId();
		initAll();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get isStandardLayout() {
		return this.store.pipe(
			take(1),
			select(selectRouteData),
			map((routeData) => routeData && !routeData['isCustomLayout'])
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
			integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
		});
	}
}
