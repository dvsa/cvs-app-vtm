// @ts-ignore
import { createHash } from 'node:crypto';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { UserService } from '@services/user-service/user-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AnalyticsService {
	private userService = inject(UserService);

	pushToDataLayer(data: any): void {
		// @ts-ignore
		window.dataLayer?.push(data);
	}

	async setUserId(): Promise<void> {
		const uniqueId = await this.createUniqueId();
		this.pushToDataLayer({ UserIDDataLayer: uniqueId });
	}

	async createUniqueId(): Promise<string> {
		if (!environment.production) {
			const userEmail = await firstValueFrom(this.userService.userEmail$);
			return createHash('sha256').update(userEmail).digest('hex');
		}
		const userId = await firstValueFrom(this.userService.id$);
		if (environment.production && userId) {
			return createHash('sha256').update(userId).digest('hex');
		}

		return 'N/A';
	}
}
