import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './features/home/home.component';
import { SearchComponent } from './features/search/search.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
    // canActivate: [MsalGuard]
  },
  {
    path: 'search',
    component: SearchComponent
    // canActivate: [MsalGuard]
  },
  {
    path: 'test-results',
    // canLoad: [MsalGuard],
    loadChildren: () => import('./features/test-results/test-results.module').then((m) => m.TestResultsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
