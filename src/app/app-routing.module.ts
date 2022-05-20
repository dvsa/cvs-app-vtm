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
        canLoad: [MsalGuard],
        loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule)
      },
      {
        path: 'search',
        data: { title: 'Technical record search' },
        canLoad: [MsalGuard],
        loadChildren: () => import('./features/search/search.module').then((m) => m.SearchModule)
      },
      {
        path: 'test-records',
        canLoad: [MsalGuard],
        loadChildren: () => import('./features/test-records/test-records.module').then((m) => m.TestRecordsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
