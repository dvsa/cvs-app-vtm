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
	httpService = inject(HttpService);

	config = signal<FeatureConfig | null>(null);

	async loadConfig() {
		this.httpService
			.getFeatureFlags()
			.pipe(take(1))
			.subscribe((config) => {
				this.config.set({ ...config });
			});
	}

	setConfig(config: FeatureConfig): void {
		this.config.set(config);
	}

	isFeatureEnabled(key: string) {
		if (!this.config()) return false;
		const feature = get(this.config(), key);
		if (!feature) return false;

		return feature.enabled;
	}
}
