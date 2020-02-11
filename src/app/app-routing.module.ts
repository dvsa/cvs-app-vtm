import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {LandingPageComponent} from '@app/landing-page/landing-page.component';
import {TechnicalRecordCreateComponent} from '@app/technical-record-create/technical-record-create.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthenticationGuard]},
  {path: 'home', pathMatch: 'full', component: LandingPageComponent , canActivate: [AuthenticationGuard]},
  {
    path: 'home/search',
    loadChildren: './technical-record-search/technical-record-search.module#TechnicalRecordSearchModule',
    canActivate: [AuthenticationGuard]
  },
  {path: 'home/create', component: TechnicalRecordCreateComponent, canActivate: [AuthenticationGuard]},
  {
    path: 'technical-record',
    loadChildren: './technical-record/technical-record.module#TechnicalRecordModule',
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
