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
      tenant: '<tenant_id>',
      clientId: '<client_id>',
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