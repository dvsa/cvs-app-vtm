// @ts-ignore
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { CryptoService } from '@services/crypto/crypto.service';
import { UserService } from '@services/user-service/user-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AnalyticsService {
	private userService = inject(UserService);
	private cryptoService = inject(CryptoService);

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
			return await this.cryptoService.sha256Hash(userEmail);
		}
		const userId = await firstValueFrom(this.userService.id$);
		if (environment.production && userId) {
			return await this.cryptoService.sha256Hash(userId);
		}

		return 'N/A';
	}
}
