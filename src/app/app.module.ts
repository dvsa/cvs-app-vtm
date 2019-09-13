import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationGuard, MsAdalAngular6Module } from 'microsoft-adal-angular6';
import {TechnicalRecordModule} from './technical-record/technical-record.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TechnicalRecordModule,
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
    })
  ],
  providers: [AuthenticationGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }