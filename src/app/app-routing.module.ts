import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { LandingPageComponent } from '@app/landing-page/landing-page.component';
import { TechnicalRecordCreateComponent } from '@app/technical-record-create/technical-record-create.component';
import { MultipleRecordsContainer } from '@app/multiple-records/multiple-records.container';
import { FormStateGuard } from './guards/form-state.guard';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [AuthenticationGuard, FormStateGuard]
  },
  {
    path: 'search',
    loadChildren:
      './technical-record-search/technical-record-search.module#TechnicalRecordSearchModule',
    canActivate: [AuthenticationGuard, FormStateGuard]
  },
  {
    path: 'create',
    component: TechnicalRecordCreateComponent,
    canActivate: [AuthenticationGuard, FormStateGuard]
  },
  {
    path: 'technical-record',
    loadChildren: './technical-record/technical-record.module#TechnicalRecordModule',
    canActivate: [AuthenticationGuard, FormStateGuard]
  },
  {
    path: 'multiple-records',
    component: MultipleRecordsContainer,
    canActivate: [AuthenticationGuard, FormStateGuard]
  },
  {
    path: 'test-record',
    loadChildren: './test-record/test-record.module#TestRecordModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
