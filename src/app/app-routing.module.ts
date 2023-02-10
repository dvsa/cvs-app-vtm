import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { TitleResolver } from './resolvers/title/title.resolver';
import { Roles } from '@models/roles.enum';
import { TechRecordViewResolver } from './resolvers/tech-record-view/tech-record-view.resolver';
import { PageNotFoundComponent } from '@core/components/page-not-found/page-not-found.component';
import { ServerErrorComponent } from '@core/components/server-error/server-error.component';
import { VersionComponent } from '@core/components/version/version.component';

const routes: Routes = [
  {
    path: '',
    resolve: { title: TitleResolver },
    children: [
      {
        path: '',
        data: { title: 'Home', roles: Roles.TechRecordView },
        canActivate: [MsalGuard, RoleGuard],
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'search',
        data: { title: 'Technical record search', roles: Roles.TechRecordView },
        canActivate: [MsalGuard, RoleGuard],
        loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'create',
        data: { title: 'Create new technical record', roles: Roles.TechRecordCreate },
        canActivate: [MsalGuard, RoleGuard],
        loadChildren: () => import('./features/create/create.module').then(m => m.CreateModule)
      },
      {
        path: 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
        data: { title: 'Test Result', roles: Roles.TestResultView },
        canActivate: [MsalGuard, RoleGuard],
        resolve: { techRecord: TechRecordViewResolver },
        loadChildren: () => import('./features/test-records/amend/amend-test-records.module').then(m => m.AmendTestRecordsModule)
      },
      {
        path: 'tech-records/:systemNumber',
        data: { title: 'Tech Record', roles: Roles.TechRecordView },
        canActivate: [MsalGuard, RoleGuard],
        loadChildren: () => import('./features/tech-record/tech-record.module').then(m => m.TechRecordsModule)
      },
      {
        path: 'error',
        pathMatch: 'full',
        component: ServerErrorComponent
      },
      {
        path: 'version',
        pathMatch: 'full',
        component: VersionComponent
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
