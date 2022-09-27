import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { TitleResolver } from './resolvers/title/title.resolver';
import { Roles } from '@models/roles.enum';
import { TechRecordViewResolver } from './resolvers/tech-record-view/tech-record-view.resolver';

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
        path: 'test-records/:systemNumber/test-result/:testResultId/:testNumber',
        data: { title: 'Test Result', roles: Roles.TestResultView },
        canActivate: [MsalGuard, RoleGuard],
        resolve: { techRecord: TechRecordViewResolver },
        loadChildren: () => import('./features/test-records/amend/amend-test-records.module').then(m => m.AmendTestRecordsModule)
      },
      {
        path: 'tech-records/:systemNumber/:vin',
        data: { title: 'Tech Record', roles: Roles.TechRecordView },
        canActivate: [MsalGuard, RoleGuard],
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
