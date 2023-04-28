import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { TitleResolver } from './resolvers/title/title.resolver';
import { Roles } from '@models/roles.enum';
import { TechRecordViewResolver } from './resolvers/tech-record-view/tech-record-view.resolver';
import { PageNotFoundComponent } from '@core/components/page-not-found/page-not-found.component';
import { ServerErrorComponent } from '@core/components/server-error/server-error.component';
import { CancelEditTechGuard } from '@guards/cancel-edit-tech/cancel-edit-tech.guard';

const routes: Routes = [
  {
    path: '',
    resolve: { title: TitleResolver },
    children: [
      {
        path: '',
        data: { title: 'Home', roles: Roles.TechRecordView },
        canActivate: [MsalGuard, RoleGuard],
        canDeactivate: [CancelEditTechGuard],
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'search',
        data: { title: 'Technical record search', roles: Roles.TechRecordView },
        canActivate: [MsalGuard, RoleGuard],
        canDeactivate: [CancelEditTechGuard],
        loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'create',
        data: { title: 'Create new technical record', roles: Roles.TechRecordCreate },
        canActivate: [MsalGuard, RoleGuard],
        loadChildren: () => import('./features/tech-record/create/create-tech-records.module').then(m => m.CreateTechRecordsModule)
      },
      {
        path: 'create-batch-trl',
        data: { title: 'Trailer batch records', roles: Roles.TechRecordCreate },
        canActivate: [MsalGuard, RoleGuard],
        loadChildren: () => import('./features/tech-record/create-batch-trl/create-batch-trl.module').then(m => m.CreateBatchTrlModule)
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
        path: 'reference-data',
        data: { title: 'Reference Data', roles: Roles.ReferenceDataView },
        canActivate: [MsalGuard, RoleGuard],
        loadChildren: () => import('./features/reference-data/reference-data.module').then(m => m.ReferenceDataModule)
      },
      {
        path: 'error',
        pathMatch: 'full',
        component: ServerErrorComponent
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
