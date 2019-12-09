import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AuthenticationGuard, MsAdalAngular6Module, MsAdalAngular6Service} from 'microsoft-adal-angular6';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ShellPageModule} from '@app/shell/shell.page.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSquare, faCheckSquare, faCoffee, faBars} from '@fortawesome/free-solid-svg-icons';
import {faSquare as farSquare, faCheckSquare as farCheckSquare} from '@fortawesome/free-regular-svg-icons';
import {faStackOverflow, faGithub, faMedium} from '@fortawesome/free-brands-svg-icons';
import {StoreModule} from '@ngrx/store';
import {appReducers} from '@app/store/reducers/app.reducers';
import {EffectsModule} from '@ngrx/effects';
import {VehicleTechRecordModelEffects} from '@app/store/effects/VehicleTechRecordModel.effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {environment} from '@environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {VehicleTestResultModelEffects} from '@app/store/effects/VehicleTestResultModel.effects';
import {TechnicalRecordSearchModule} from './technical-record-search/technical-record-search.module';
import {CustomRouterStateSerializer} from './shared/utils';
import {CommonModule} from '@angular/common';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from '@app/app-routing.module';
import {AppConfig} from '@app/app.config';
import {AuthTokenInterceptor} from '@app/technical-record-search/auth-token-interceptor';
import {CustomSerializer} from '@app/store/reducers';

let adalConfig: any; // will be initialized by APP_INITIALIZER
export function msAdalAngular6ConfigFactory() {
  return adalConfig;
}

export function initializeApp(appConfig: AppConfig) {
  const promise = appConfig.load().then(() => {
    adalConfig = {
      tenant: AppConfig.settings.adalConfig.tenant,
      clientId: AppConfig.settings.adalConfig.clientId,
      redirectUri: window.location.origin,
      endpoints: AppConfig.settings.adalConfig.endpoints,
      navigateToLoginRequestUrl: false,
      cacheLocation: AppConfig.settings.adalConfig.cacheLocation
    };
  });
  return () => promise;
}

export const COMPONENTS = [
  AppComponent
];

@NgModule({
  imports: [
    MsAdalAngular6Module,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MaterialModule,
    SharedModule,
    TechnicalRecordSearchModule,
    ShellPageModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    StoreModule.forRoot(appReducers),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    !(environment.name === 'deploy') ? StoreDevtoolsModule.instrument() : [],
    AppRoutingModule,
    EffectsModule.forRoot([VehicleTechRecordModelEffects, VehicleTestResultModelEffects])
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faCoffee, faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, faBars);
  }
}

