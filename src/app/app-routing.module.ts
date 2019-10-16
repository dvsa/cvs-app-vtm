import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {AppComponent} from './app.component';
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';
import {VehicleDetailsComponent} from './vehicle-details/vehicle-details.component';
import {LandingPageComponent} from "@app/landing-page/landing-page.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthenticationGuard]},
  {path: 'home', loadChildren: './shell/shell.page.module#ShellPageModule', canActivate: [AuthenticationGuard]},
  {path: 'landing-page', component: LandingPageComponent},
  {path: 'create', component: CreateVehicleComponent},
  {path: 'details', component: VehicleDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
