import { environment } from '@/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpService } from '@services/http/http.service';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import {
	fetchFeatureFlags,
	fetchFeatureFlagsFailure,
	fetchFeatureFlagsSuccess,
	fetchLocalFeatureFlags,
	fetchRemoteFeatureFlags,
} from './feature-flags.actions';
import { FeatureConfig } from './feature-flags.feature';

@Injectable()
export class FeatureFlagsEffects {
	actions = inject(Actions);
	http = inject(HttpClient);
	httpService = inject(HttpService);
	router = inject(Router);
	msalBroadcast = inject(MsalBroadcastService);
	msal = inject(MsalService);

	// Remote feature flags require an auth token, so the APP_INITIALIZER dispatch races MSAL on a fresh
	// session (pre-login) or a cached reload (mid silent-init) and can fail before a token exists. Re-fetch
	// once MSAL has settled (InteractionStatus.None) with an authenticated account — this covers both the
	// interactive-login and cached/silent paths so flags reliably load before flow decisions (e.g. v1 vs v2
	// tech-record). Non-blocking: bootstrap is not delayed. Also re-runs after silent token refreshes, which
	// harmlessly refreshes flags mid-session.
	refetchFeatureFlagsOnAuth = createEffect(() =>
		this.msalBroadcast.inProgress$.pipe(
			filter((status: InteractionStatus) => status === InteractionStatus.None),
			filter(() => this.msal.instance.getAllAccounts().length > 0),
			map(() => fetchRemoteFeatureFlags())
		)
	);

	onFetchFeatureFlags = createEffect(() =>
		this.actions.pipe(
			ofType(fetchFeatureFlags),
			map(({ local }) => (local ? fetchLocalFeatureFlags() : fetchRemoteFeatureFlags()))
		)
	);

	onFetchLocalFeatureFlags = createEffect(() =>
		this.actions.pipe(
			ofType(fetchLocalFeatureFlags),
			switchMap(() =>
				this.http.get<FeatureConfig>(getLocalFeatureFlags()).pipe(
					map((config) => fetchFeatureFlagsSuccess({ config })),
					catchError((error) => of(fetchFeatureFlagsFailure({ error })))
				)
			)
		)
	);

	onFetchRemoteFeatureFlags = createEffect(() =>
		this.actions.pipe(
			ofType(fetchRemoteFeatureFlags),
			switchMap(() =>
				this.httpService.getFeatureFlags().pipe(
					map((config) => fetchFeatureFlagsSuccess({ config })),
					catchError((error) => of(fetchFeatureFlagsFailure({ error })))
				)
			)
		)
	);
}

export function getLocalFeatureFlags() {
	switch (environment.TARGET_ENV) {
		case 'prod':
			return 'assets/featureToggle.prod.json';
		case 'integration':
			return 'assets/featureToggle.int.json';
		case 'preprod':
			return 'assets/featureToggle.preprod.json';
		default:
			return 'assets/featureToggle.json';
	}
}
