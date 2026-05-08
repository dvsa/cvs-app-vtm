import { environment } from '@/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpService } from '@services/http/http.service';
import { catchError, map, of, switchMap } from 'rxjs';
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
