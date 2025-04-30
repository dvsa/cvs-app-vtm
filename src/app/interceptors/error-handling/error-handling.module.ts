import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ErrorInterceptor, HTTP_RESPONSE_REDIRECT, HttpResponseRedirectConfig } from './error-handling.interceptor';

@NgModule({
	imports: [CommonModule],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorInterceptor,
			multi: true,
		},
	],
})
export class ErrorInterceptorModule {
	constructor(@Optional() @SkipSelf() parentModule?: ErrorInterceptorModule) {
		if (parentModule) {
			throw new Error('ErrorInterceptorModule is already loaded. Import it in the AppModule only');
		}
	}

	static forRoot(config?: HttpResponseRedirectConfig): ModuleWithProviders<ErrorInterceptorModule> {
		return {
			ngModule: ErrorInterceptorModule,
			providers: [{ provide: HTTP_RESPONSE_REDIRECT, useValue: config }],
		};
	}
}
