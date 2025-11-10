import { environment } from '@/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { get } from 'lodash';
import { take } from 'rxjs';
import { HttpService } from '../http/http.service';

export interface FeatureConfig {
	[key: string]: { enabled: boolean };
}

@Injectable({
	providedIn: 'root',
})
export class FeatureToggleService {
	http = inject(HttpClient);
	httpService = inject(HttpService);

	config = signal<FeatureConfig | null>(null);

	async loadConfig() {
		await this.loadRemoteConfig();
		// await this.loadLocalConfig();
	}

	async loadLocalConfig() {
		this.http
			.get<FeatureConfig>(this.getConfig())
			.pipe(take(1))
			.subscribe((config) => {
				this.config.set({ ...config });
			});
	}

	async loadRemoteConfig() {
		this.httpService
			.getFeatureFlags()
			.pipe(take(1))
			.subscribe((config) => {
				this.config.set({ ...config });
			});
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

	setConfig(config: FeatureConfig): void {
		this.config.set(config);
	}

	isFeatureEnabled(...keys: string[]) {
		if (!this.config()) return false;
		return keys?.some((key) => get(this.config(), key)?.enabled);
	}
}
