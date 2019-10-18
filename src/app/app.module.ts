import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, RouteReuseStrategy, Routes} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {WebComponentsModule} from './web-components/web-components.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthenticationGuard, MsAdalAngular6Module} from 'microsoft-adal-angular6';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MaterialModule} from "./material.module";
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';
import {VehicleDetailsComponent} from './vehicle-details/vehicle-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import {VehicleExistsDialogComponent} from './vehicle-exists-dialog/vehicle-exists-dialog.component';
import {HttpClientModule} from "@angular/common/http";
import {ComponentsModule} from "@app/components/components.module";
import {ShellPageModule} from "@app/shell/shell.page.module";
import {VehicleNotFoundDialogComponent} from "@app/vehicle-not-found-dialog/vehicle-not-found-dialog.component";

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
    MaterialModule,
    ComponentsModule,
    ShellPageModule,
    IonicModule.forRoot(),
    WebComponentsModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule,
    MsAdalAngular6Module.forRoot({
      tenant: '',
      clientId: '',
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
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent],
  exports: [ ],
  entryComponents: [VehicleExistsDialogComponent, VehicleNotFoundDialogComponent]
})
export class AppModule {
}
