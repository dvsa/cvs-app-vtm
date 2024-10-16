import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get, has } from 'lodash';
import { lastValueFrom, take } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FeatureConfig {
	[key: string]: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class FeatureToggleService {
	config: FeatureConfig | null = null;
	configPath = this.getConfig();

	constructor(private http: HttpClient) {}

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
