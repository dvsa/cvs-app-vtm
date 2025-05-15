import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DelayedRetryInterceptor, HTTP_RETRY_CONFIG, HttpRetryConfig } from './delayed-retry.interceptor';

@NgModule({
	imports: [CommonModule],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: DelayedRetryInterceptor,
			multi: true,
		},
	],
})
export class DelayedRetryModule {
	constructor(@Optional() @SkipSelf() parentModule?: DelayedRetryModule) {
		if (parentModule) {
			throw new Error('DelayedRetryModule is already loaded. Import it in the AppModule only');
		}
	}

	static forRoot(config?: HttpRetryConfig): ModuleWithProviders<DelayedRetryModule> {
		return {
			ngModule: DelayedRetryModule,
			providers: [{ provide: HTTP_RETRY_CONFIG, useValue: config }],
		};
	}
}
