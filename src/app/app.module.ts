import {
  HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ErrorHandler,
  LOCALE_ID, NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DocumentRetrievalApiModule, Configuration as DocumentRetrievalConfiguration } from '@api/document-retrieval';
import { ApiModule as ReferenceDataApiModule, Configuration as ReferenceDataConfiguration } from '@api/reference-data';
import { Configuration as TestResultsApiConfiguration, ApiModule as TestResultsApiModule } from '@api/test-results';
import { Configuration as TestTypesApiConfiguration, ApiModule as TestTypesApiModule } from '@api/test-types';
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
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import * as Sentry from '@sentry/angular-ivy';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
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

const featureFactory = (featureFlagsService: FeatureToggleService) => () =>
  featureFlagsService.loadConfig();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    HttpClientModule,
    AppStoreModule,
    InterceptorModule,
    CoreModule,
    TestResultsApiModule.forRoot(() => new TestResultsApiConfiguration({ basePath: environment.VTM_API_URI })),
    TestTypesApiModule.forRoot(() => new TestTypesApiConfiguration({ basePath: environment.VTM_API_URI })),
    ReferenceDataApiModule.forRoot(() => new ReferenceDataConfiguration({ basePath: environment.VTM_API_URI })),
    DocumentRetrievalApiModule.forRoot(
      () =>
        new DocumentRetrievalConfiguration({
          basePath: environment.VTM_API_URI,
          apiKeys: {
            'X-Api-Key': environment.DOCUMENT_RETRIEVAL_API_KEY,
          },
        }),
    ),
  ],
  providers: [
    provideHttpClient(withInterceptors([withHttpCacheInterceptor()])),
    provideHttpCache(),
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
  ],
  exports: [],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {
}
