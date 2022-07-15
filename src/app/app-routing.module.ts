import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TitleResolver } from './resolvers/title/title.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { title: TitleResolver },
    children: [
      {
        path: '',
        data: { title: 'Home' },
        canActivate: [MsalGuard],
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'search',
        data: { title: 'Technical record search' },
        canActivate: [MsalGuard],
        loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'test-records',
        canActivate: [MsalGuard],
        loadChildren: () => import('./features/test-records/test-records.module').then(m => m.TestRecordsModule)
      },
      {
        path: 'tech-records',
        canActivate: [MsalGuard],
        loadChildren: () => import('./features/tech-record/tech-record.module').then(m => m.TechRecordsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
