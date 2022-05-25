import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { SharedModule } from '@shared/shared.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorComponent } from './features/global-error/global-error.component';
import { HomeButtonComponent } from './features/home/components/home-button/home-button.component';
import { HomeComponent } from './features/home/home.component';
import { DynamicFormsModule } from './forms/dynamic-forms.module';
import { InterceptorModule } from './interceptors/interceptor.module';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SpinnerComponent } from './layout/spinner/spinner.component';
import { UserService } from './services/user-service/user-service';
import { AppStoreModule } from './store/app-store.module';

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
  protectedResourceMap.set(environment.VTM_API_URI, ['']);

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
  declarations: [AppComponent, HeaderComponent, FooterComponent, HomeComponent, HomeButtonComponent, GlobalErrorComponent, SpinnerComponent],
  imports: [BrowserModule, AppRoutingModule, MsalModule, HttpClientModule, AppStoreModule, DynamicFormsModule, ReactiveFormsModule, SharedModule, InterceptorModule],
  providers: [
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
