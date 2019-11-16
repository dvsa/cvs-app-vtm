import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {WebComponentsModule} from './web-components/web-components.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthenticationGuard, MsAdalAngular6Module} from 'microsoft-adal-angular6';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';
import {VehicleDetailsComponent} from './vehicle-details/vehicle-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import {VehicleExistsDialogComponent} from './vehicle-exists-dialog/vehicle-exists-dialog.component';
import {HttpClientModule} from '@angular/common/http';
import {ComponentsModule} from '@app/components/components.module';
import {ShellPageModule} from '@app/shell/shell.page.module';
import {VehicleNotFoundDialogComponent} from '@app/vehicle-not-found-dialog/vehicle-not-found-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquare, faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { StoreModule } from '@ngrx/store';
import {appReducers} from '@app/store/reducers/app.reducers';
import {EffectsModule} from '@ngrx/effects';
import {VehicleTechRecordModelEffects} from '@app/store/effects/VehicleTechRecordModel.effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {environment} from '@environment/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {VehicleTestResultModelEffects} from '@app/store/effects/VehicleTestResultModel.effects';
import {CustomSerializer} from '@app/store/reducers';

@NgModule({
  declarations: [
    AppComponent,
    CreateVehicleComponent,
    VehicleDetailsComponent,
    VehicleExistsDialogComponent,
    VehicleNotFoundDialogComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    MaterialModule,
    ComponentsModule,
    ShellPageModule,
    IonicModule.forRoot(),
    WebComponentsModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([VehicleTechRecordModelEffects, VehicleTestResultModelEffects]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    AppRoutingModule,
    MsAdalAngular6Module.forRoot({
      tenant: '',
      clientId: '',
      redirectUri: window.location.origin,
      endpoints: {
        'https://localhost/Api/': 'xxx-bae6-4760-b434-xxx'
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [AppComponent],
  exports: [ ],
  entryComponents: [VehicleExistsDialogComponent, VehicleNotFoundDialogComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faCoffee, faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium);
  }


}

