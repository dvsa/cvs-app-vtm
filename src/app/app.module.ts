import {CommonModule} from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ShellPage} from '@app/shell/shell.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSquare, faCheckSquare, faCoffee, faBars} from '@fortawesome/free-solid-svg-icons';
import {faSquare as farSquare, faCheckSquare as farCheckSquare} from '@fortawesome/free-regular-svg-icons';
import {faStackOverflow, faGithub, faMedium} from '@fortawesome/free-brands-svg-icons';
import {appReducers} from '@app/store/reducers/app.reducers';
import {EffectsModule} from '@ngrx/effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {environment} from '@environments/environment';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {AppConfig} from '@app/app.config';
import {AppRoutingModule} from '@app/app-routing.module';
import {AuthTokenInterceptor} from '@app/technical-record-search/auth-token-interceptor';
import {CustomSerializer} from '@app/store/reducers';
import {LandingPageComponent} from '@app/landing-page/landing-page.component';
import {HeaderComponent} from '@app/shell/header/header.component';
import {FooterComponent} from '@app/shell/footer/footer.component';
import {TechnicalRecordCreateComponent} from '@app/technical-record-create/technical-record-create.component';
import {VehicleTechRecordModelEffects} from '@app/store/effects/VehicleTechRecordModel.effects';
import {AuthenticationGuard, MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {PendingChangesGuard} from './shared/pending-changes-guard/pending-changes.guard';
import {SharedModule} from './shared/shared.module';

let adalConfig: any; // will be initialized by APP_INITIALIZER
export function msAdalAngular6ConfigFactory() {
  console.log(`initializing msAdal with adalConfig => ${JSON.stringify(adalConfig)}`);
  return adalConfig;
}

export function initializeApp(appConfig: AppConfig) {
  const promise = appConfig.load().then(() => {
    adalConfig = {
      tenant: appConfig.settings.adalConfig.tenant,
      clientId: appConfig.settings.adalConfig.clientId,
      redirectUri: appConfig.settings.adalConfig.redirectUri,
      endpoints: appConfig.settings.adalConfig.endpoints,
      navigateToLoginRequestUrl: true,
      cacheLocation: appConfig.settings.adalConfig.cacheLocation
    };
  });
  return () => promise;
}

export const COMPONENTS = [
  AppComponent,
  ShellPage,
  LandingPageComponent,
  HeaderComponent,
  FooterComponent,
  TechnicalRecordCreateComponent,
];

@NgModule({
  imports: [
    MsAdalAngular6Module,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MaterialModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    StoreModule.forRoot(appReducers),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    !(environment.name === 'deploy') ? StoreDevtoolsModule.instrument() : [],
    AppRoutingModule,
    EffectsModule.forRoot([VehicleTechRecordModelEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    {provide: RouterStateSerializer, useClass: CustomSerializer},
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    },
    MsAdalAngular6Service,
    {
      provide: 'adalConfig',
      useFactory: msAdalAngular6ConfigFactory,
      deps: []
    },
    AuthenticationGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    },
    PendingChangesGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faCoffee, faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, faBars);
  }
}

