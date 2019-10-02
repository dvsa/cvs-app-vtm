import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { WebComponentsModule } from './web-components/web-components.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationGuard, MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    WebComponentsModule.forRoot(),
    AppRoutingModule,
    MsAdalAngular6Module.forRoot({
      tenant: '6c448d90-4ca1-4caf-ab59-0a2aa67d7801',
      clientId: '54d151b6-2ca8-4018-8c70-f9ee600d91c7',
      redirectUri: window.location.origin,
      endpoints: {
        "https://localhost/Api/": "xxx-bae6-4760-b434-xxx"
      },
      navigateToLoginRequestUrl: true,
      cacheLocation: 'localStorage',
    }),
    BrowserAnimationsModule
  ],
  providers: [
    AuthenticationGuard,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
