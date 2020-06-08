import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { LandingPageComponent } from '@app/landing-page/landing-page.component';
import { TechnicalRecordCreateComponent } from '@app/technical-record-create/technical-record-create.component';
import { MultipleRecordsContainer } from '@app/multiple-records/multiple-records.container';
import { PreparersGuard } from '@app/test-record/guards/preparers.guard';
import { TestStationsGuard } from '@app/test-record/guards/test-stations.guard';
import { TestResultGuard } from '@app/test-record/guards/test-result.guard';
import { ModalGuard } from './modal/modal.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [AuthenticationGuard, ModalGuard] },
  {
    path: 'search',
    loadChildren:
      './technical-record-search/technical-record-search.module#TechnicalRecordSearchModule',
    canActivate: [AuthenticationGuard, ModalGuard]
  },
  {
    path: 'create',
    component: TechnicalRecordCreateComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'technical-record',
    loadChildren: './technical-record/technical-record.module#TechnicalRecordModule',
    canActivate: [AuthenticationGuard, ModalGuard],
    // canDeactivate: [ModalGuard]
  },
  {
    path: 'multiple-records',
    component: MultipleRecordsContainer,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'test-record/:id',
    loadChildren: './test-record/test-record.module#TestRecordModule',
    canActivate: [TestResultGuard, PreparersGuard, TestStationsGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
