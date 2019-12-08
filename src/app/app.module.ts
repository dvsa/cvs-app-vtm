import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AuthenticationGuard, MsAdalAngular6Module} from 'microsoft-adal-angular6';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {ShellPageModule} from '@app/shell/shell.page.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquare, faCheckSquare, faCoffee, faBars } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { StoreModule } from '@ngrx/store';
import {appReducers} from '@app/store/reducers/app.reducers';
import {EffectsModule} from '@ngrx/effects';
import {VehicleTechRecordModelEffects} from '@app/store/effects/VehicleTechRecordModel.effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {environment} from '@environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {VehicleTestResultModelEffects} from '@app/store/effects/VehicleTestResultModel.effects';
import { TechnicalRecordSearchModule } from './technical-record-search/technical-record-search.module';
import { CustomRouterStateSerializer } from './shared/utils';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import {AppRoutingModule} from '@app/app-routing.module';

const redirectUri = `${window.location.origin}`;

export const COMPONENTS = [
  AppComponent
];

@NgModule({
  imports: [
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
    HttpClientModule,
    StoreModule.forRoot(appReducers),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    AppRoutingModule,
    EffectsModule.forRoot([VehicleTechRecordModelEffects, VehicleTestResultModelEffects]),
    MsAdalAngular6Module.forRoot({
      tenant: '',
      clientId: '',
      redirectUri: redirectUri,
      endpoints: {
        'https://localhost/Api/': 'xxx-bae6-4760-b434-xxx'
      },
      navigateToLoginRequestUrl: true,
      cacheLocation: 'localStorage',
    })
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    AuthenticationGuard,
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faCoffee, faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, faBars);
  }
}

