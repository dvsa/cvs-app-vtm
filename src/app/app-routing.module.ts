import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [MsalGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
