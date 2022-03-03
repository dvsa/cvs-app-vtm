import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppConfig } from '@app/app.config';
import { LandingPageComponent } from '@app/landing-page/landing-page.component';
import { FooterComponent } from '@app/shell/footer/footer.component';
import { HeaderComponent } from '@app/shell/header/header.component';
import { ShellPage } from '@app/shell/shell.page';
import { CustomSerializer } from '@app/store';
import { appReducers } from '@app/store/reducers/app.reducers';
import { TechnicalRecordCreateComponent } from '@app/technical-record-create/technical-record-create.component';
import { AuthTokenInterceptor } from '@app/technical-record-search/auth-token-interceptor';
import { environment } from '@environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faMedium, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckSquare as farCheckSquare,
  faSquare as farSquare
} from '@fortawesome/free-regular-svg-icons';
import { faBars, faCheckSquare, faCoffee, faSquare } from '@fortawesome/free-solid-svg-icons';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  AuthenticationGuard,
  MsAdalAngular6Module,
  MsAdalAngular6Service
} from 'microsoft-adal-angular6';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { PendingChangesGuard } from './shared/pending-changes-guard/pending-changes.guard';
import { SharedModule } from './shared/shared.module';
import { SpinnerLoaderComponent } from './shared/spinner-loader/spinner-loader.component';
import { MultipleRecordsContainer } from '@app/multiple-records/multiple-records.container';
import { MultipleRecordsComponent } from '@app/multiple-records/multiple-records.component';
import { TestRecordModule } from '@app/test-record/test-record.module';
import { LogoutModalComponent } from './shell/header/logout-modal/logout-modal.component';
import { ROOT_EFFECTS } from './store/state/app.state';
import { ModalModule } from './modal/modal.module';

let adalConfig: any; // will be initialized by APP_INITIALIZER
export function msAdalAngular6ConfigFactory() {
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
  SpinnerLoaderComponent,
  MultipleRecordsContainer,
  MultipleRecordsComponent,
  LogoutModalComponent
];

@NgModule({
  imports: [
    AppRoutingModule,
    MsAdalAngular6Module,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MaterialModule,
    SharedModule,
    ModalModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    StoreModule.forRoot(appReducers),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    !(environment.name === 'deploy') ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot(ROOT_EFFECTS),
    TestRecordModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents: [LogoutModalComponent],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
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
    PendingChangesGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(
      faCoffee,
      faSquare,
      faCheckSquare,
      farSquare,
      farCheckSquare,
      faStackOverflow,
      faGithub,
      faMedium,
      faBars
    );
  }
}
