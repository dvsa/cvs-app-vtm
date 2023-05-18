import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { BatchTrlDetailsComponent } from './components/batch-trl-details/batch-trl-details.component';
import { BatchTrlResultsComponent } from './components/batch-trl-results/batch-trl-results.component';
import { BatchTrlTemplateComponent } from './components/batch-trl-template/batch-trl-template.component';
import { CreateBatchTrlResolver } from './resolvers/create-batch-trl.resolver';
import { TechRecordSearchTyresComponent } from '../components/tech-record-search-tyres/tech-record-search-tyres.component';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { roles: Roles.TechRecordCreate, isCustomLayout: true },
    canActivate: [MsalGuard, RoleGuard],
    children: [
      {
        path: '',
        component: BatchTrlTemplateComponent,
        canActivate: [MsalGuard, RoleGuard],
        resolve: [CreateBatchTrlResolver]
      },
      {
        path: 'details',
        component: BatchTrlDetailsComponent,
        data: { tile: 'Add batch of trailers', roles: Roles.TechRecordCreate }
      },
      {
        path: 'batch-results',
        data: { tile: 'Batch summary' },
        component: BatchTrlResultsComponent
      },
      {
        path: 'tyre-search/:axleNumber',
        component: TechRecordSearchTyresComponent,
        data: { title: 'Tyre search', roles: Roles.TechRecordCreate, isEditing: true },
        canActivate: [MsalGuard, RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateBatchTrlRoutingModule {}
