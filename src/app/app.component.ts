import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Store, select } from '@ngrx/store';
import * as Sentry from '@sentry/angular';
import { LoadingService } from '@services/loading/loading.service';
import { UserService } from '@services/user-service/user-service';
import { selectRouteData } from '@store/router/router.selectors';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { initAll } from 'govuk-frontend/govuk/all';
import { Subject, map, take, takeUntil } from 'rxjs';
import packageInfo from '../../package.json';
import { State } from './store';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
	currentDate = new Date();
	private destroy$ = new Subject<void>();
	private sentryInitialized: boolean | undefined;
	private interval?: ReturnType<typeof setInterval>;

	constructor(
		public userService: UserService,
		private loadingService: LoadingService,
		private router: Router,
		private gtmService: GoogleTagManagerService,
		private store: Store<State>
	) {}

	async ngOnInit() {
		if (!this.sentryInitialized) {
			this.startSentry();
		}
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
		initAll();
		this.checkDateChange();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		clearInterval(this.interval);
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
		this.sentryInitialized = true;
	}

	checkDateChange() {
		this.interval = setInterval(() => {
			const newDate = new Date();
			if (newDate.getDate() !== this.currentDate.getDate()) {
				this.currentDate = newDate;
				this.reinitializeApp();
			}
		}, 21600000); // Check every six hours
	}

	reinitializeApp() {
		this.ngOnInit().then((r) => r);
	}
}
