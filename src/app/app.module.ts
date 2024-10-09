import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
	MSAL_GUARD_CONFIG,
	MSAL_INSTANCE,
	MSAL_INTERCEPTOR_CONFIG,
	MsalBroadcastService,
	MsalGuard,
	MsalGuardConfiguration,
	MsalInterceptor,
	MsalInterceptorConfiguration,
	MsalModule,
	MsalRedirectComponent,
	MsalService,
} from '@azure/msal-angular';
import {
	BrowserCacheLocation,
	IPublicClientApplication,
	InteractionType,
	PublicClientApplication,
} from '@azure/msal-browser';
import { ResponseLoggerInterceptor } from '@interceptors/response-logger/response-logger.interceptor';
import * as Sentry from '@sentry/angular';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { InterceptorModule } from './interceptors/interceptor.module';
import { UserService } from './services/user-service/user-service';
import { AppStoreModule } from './store/app-store.module';

export function MSALInstanceFactory(): IPublicClientApplication {
	return new PublicClientApplication({
		auth: {
			clientId: environment.VTM_CLIENT_ID,
			authority: environment.VTM_AUTHORITY_ID,
			redirectUri: environment.VTM_REDIRECT_URI,
		},
		cache: {
			cacheLocation: BrowserCacheLocation.LocalStorage,
			storeAuthStateInCookie: true,
		},
	});
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
	const protectedResourceMap = new Map<string, Array<string>>();
	protectedResourceMap.set(environment.VTM_API_URI, [`${environment.VTM_API_CLIENT_ID}/user_impersonation`, 'email']);

	return {
		interactionType: InteractionType.Redirect,
		protectedResourceMap,
	};
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
	return {
		interactionType: InteractionType.Redirect,
		authRequest: {
			scopes: [`${environment.VTM_API_CLIENT_ID}/user_impersonation`, 'email'],
		},
		loginFailedRoute: '',
	};
}

const featureFactory = (featureFlagsService: FeatureToggleService) => () => featureFlagsService.loadConfig();

@NgModule({
	declarations: [AppComponent],
	exports: [],
	bootstrap: [AppComponent, MsalRedirectComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		MsalModule,
		AppStoreModule,
		InterceptorModule,
		CoreModule,
		GoogleTagManagerModule.forRoot({
			id: environment.VTM_GTM_CONTAINER_ID,
		}),
	],
	providers: [
		{
			provide: LOCALE_ID,
			useValue: 'en',
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: MsalInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ResponseLoggerInterceptor,
			multi: true,
		},
		{
			provide: MSAL_INSTANCE,
			useFactory: MSALInstanceFactory,
		},
		{
			provide: MSAL_GUARD_CONFIG,
			useFactory: MSALGuardConfigFactory,
		},
		{
			provide: MSAL_INTERCEPTOR_CONFIG,
			useFactory: MSALInterceptorConfigFactory,
		},
		{
			provide: APP_INITIALIZER,
			useFactory: featureFactory,
			deps: [FeatureToggleService],
			multi: true,
		},
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler({
				showDialog: true,
			}),
		},
		{
			provide: Sentry.TraceService,
			deps: [Router],
		},
		{
			provide: APP_INITIALIZER,
			useFactory: () => () => {},
			deps: [Sentry.TraceService],
			multi: true,
		},
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler({
				showDialog: false,
			}),
		},
		MsalService,
		MsalGuard,
		MsalBroadcastService,
		UserService,
		provideHttpClient(withInterceptorsFromDi()),
	],
})
export class AppModule {}
