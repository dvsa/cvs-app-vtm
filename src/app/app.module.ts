import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../environments/environment';
import { ApiModule as TestResultsApiModule, Configuration as TestResultsApiConfiguration } from '@api/test-results';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { InterceptorModule } from './interceptors/interceptor.module';
import { UserService } from './services/user-service/user-service';
import { AppStoreModule } from './store/app-store.module';
import { ApiModule as TestTypesApiModule, Configuration as TestTypesApiConfiguration } from '@api/test-types';
import { DocumentRetrievalApiModule, Configuration as DocumentRetrievalConfiguration } from '@api/document-retrieval';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.VTM_CLIENT_ID,
      authority: environment.VTM_AUTHORITY_ID,
      redirectUri: environment.VTM_REDIRECT_URI
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.VTM_API_URI, [`${environment.VTM_API_CLIENT_ID}/user_impersonation`]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [`${environment.VTM_API_CLIENT_ID}/user_impersonation`]
    },
    loginFailedRoute: ''
  };
}

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
    DocumentRetrievalApiModule.forRoot(
      () =>
        new DocumentRetrievalConfiguration({
          basePath: environment.VTM_API_URI,
          apiKeys: {
            ['X-Api-Key']: environment.DOCUMENT_RETRIEVAL_API_KEY
          }
        })
    )
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    UserService
  ],
  exports: [],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {}
