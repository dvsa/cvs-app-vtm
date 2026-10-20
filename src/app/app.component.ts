import { AsyncPipe, NgClass } from '@angular/common';
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="govuk.d.ts">
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as Sentry from '@sentry/angular';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { startSendingLogs } from '@store/logs/logs.actions';
import { selectRouteData } from '@store/router/router.selectors';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { initAll } from 'govuk-frontend/govuk/all';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
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
import { selectFeatureFlags } from './store/feature-flags/feature-flags.selectors';

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
		BreadcrumbsComponent,
	],
})
export class AppComponent implements OnInit, OnDestroy {
	userService = inject(UserService);
	loadingService = inject(LoadingService);
	router = inject(Router);
	gtmService = inject(GoogleTagManagerService);
	store = inject(Store<State>);
	analyticsService = inject(AnalyticsService);
	featureToggleService = inject(FeatureToggleService);

	private destroy$ = new Subject<void>();
	protected readonly version = packageInfo.version;
	private sentryInitialized: boolean | undefined;

	isCustomLayout$ = combineLatest([this.store.select(selectRouteData), this.store.select(selectFeatureFlags)]).pipe(
		map(([routeData]) => {
			// Use the standard (condensed) layout by default, only use full-width when specified by route data
			if (routeData && 'isCustomLayout' in routeData) {
				const featureFlags = routeData['isCustomLayout'];
				if (Array.isArray(featureFlags)) {
					// If no feature flags are specified, default to custom layout
					if (featureFlags.length === 0) {
						return true;
					}

					// Otherwise only use custom layout if none of the feature flags are enabled
					return !this.featureToggleService.isFeatureEnabled(...featureFlags);
				}
			}

			return false;
		})
	);

	isStandardLayout$ = this.isCustomLayout$.pipe(map((isCustomLayout) => !isCustomLayout));

	async ngOnInit() {
		if (!this.sentryInitialized) {
			this.startSentry();
		}
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

	startSentry() {
		Sentry.init({
			dsn: environment.SENTRY_DSN,
			environment: environment.production ? 'production' : 'development',
			release: packageInfo.version,
			replaysSessionSampleRate: 0.1,
			tracesSampleRate: 0.025,
			replaysOnErrorSampleRate: 1.0,
			integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
		});
		this.sentryInitialized = true;
	}
}
