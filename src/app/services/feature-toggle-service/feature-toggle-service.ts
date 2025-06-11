import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { get, has } from 'lodash';
import { lastValueFrom, take } from 'rxjs';

export interface FeatureConfig {
	[key: string]: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class FeatureToggleService {
	http = inject(HttpClient);

	config: FeatureConfig | null = null;
	configPath = this.getConfig();

	async loadConfig() {
		// eslint-disable-next-line no-return-assign
		return (this.config = await lastValueFrom(this.http.get<FeatureConfig>(this.configPath).pipe(take(1))));
	}

	getConfig() {
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

	isFeatureEnabled(key: string) {
		if (this.config && has(this.config, key)) {
			return get(this.config, key, false);
		}
		return false;
	}
}
