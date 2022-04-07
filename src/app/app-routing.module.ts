import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './features/home/home.component';
import { SearchComponent } from './features/search/search.component';
import { TitleResolver } from './resolvers/title/title.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { title: TitleResolver },
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {title: 'Home'}
        // canActivate: [MsalGuard]
      },
      {
        path: 'search',
        component: SearchComponent,
        data: {title: 'Technical record search'}
        // canActivate: [MsalGuard]
      },
      {
        path: 'test-results',
        // canLoad: [MsalGuard],
        loadChildren: () => import('./features/test-results/test-results.module').then((m) => m.TestResultsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
