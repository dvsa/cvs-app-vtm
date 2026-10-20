import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import {
	APP_INITIALIZER,
	ErrorHandler,
	LOCALE_ID,
	enableProdMode,
	importProvidersFrom,
	provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';
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
	MsalService,
} from '@azure/msal-angular';
import {
	BrowserCacheLocation,
	IPublicClientApplication,
	InteractionType,
	PublicClientApplication,
} from '@azure/msal-browser';
import { ResponseLoggerInterceptor } from '@interceptors/response-logger/response-logger.interceptor';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { Store } from '@ngrx/store';
import * as Sentry from '@sentry/angular';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { InterceptorModule } from './app/interceptors/interceptor.module';
import { CustomRouteReuseStrategy } from './app/services/router/custom-route-reuse-strategy';
import { UserService } from './app/services/user-service/user-service';
import { AppStoreModule } from './app/store/app-store.module';
import { fetchFeatureFlags } from './app/store/feature-flags/feature-flags.actions';
import { environment } from './environments/environment';

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

const featureFactory = (store: Store) => () => store.dispatch(fetchFeatureFlags({ local: false }));

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection(),
		importProvidersFrom(
			BrowserModule,
			AppRoutingModule,
			MsalModule,
			AppStoreModule,
			InterceptorModule,
			GoogleTagManagerModule.forRoot({
				id: environment.VTM_GTM_CONTAINER_ID,
			})
		),
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
			deps: [Store],
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
		{ provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
		MsalService,
		MsalGuard,
		MsalBroadcastService,
		UserService,
		provideHttpClient(withInterceptors([withHttpCacheInterceptor()]), withInterceptorsFromDi()),
		provideHttpCache({
			mode: 'stateManagement',
		}),
	],
}).catch((err) => console.error(err));
