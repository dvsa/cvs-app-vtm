import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MsalModule, MsalService, MsalGuard, MsalInterceptor, MsalBroadcastService, MsalRedirectComponent } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule.forRoot( new PublicClientApplication({ // MSAL Configuration
      auth: {
        clientId: "",
        authority: "",
        redirectUri: "http://localhost:4200",
      },
      cache: {
        cacheLocation : BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: true, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback: () => {},
          piiLoggingEnabled: false
        }
      }
    }), {
        interactionType: InteractionType.Redirect, // MSAL Guard Configuration
    }, {
        interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
        protectedResourceMap: new Map([
        //    ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        //    ['https://api.myapplication.com/users/*', ['customscope.read']],
        //    ['http://localhost:4200/about/', null] 
        ])
    })
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }
