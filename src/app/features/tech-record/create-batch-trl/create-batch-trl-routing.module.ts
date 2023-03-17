import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { BatchTrlDetailsComponent } from './components/batch-trl-details/batch-trl-details.component';
import { BatchTrlResultsComponent } from './components/batch-trl-results/batch-trl-results.component';
import { BatchTrlTemplateComponent } from './components/batch-trl-template/batch-trl-template.component';
import { CreateBatchTrlComponent } from './create-batch-trl.component';
import { CreateBatchTrlResolver } from './resolvers/create-batch-trl.resolver';

const routes: Routes = [
  {
    path: '',
    component: CreateBatchTrlComponent,
    data: { roles: Roles.TechRecordCreate, isCustomLayout: true },
    canActivate: [MsalGuard, RoleGuard],
    children: [
      {
        path: '',
        component: BatchTrlTemplateComponent,
        data: { title: 'Type approved trailer' },
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateBatchTrlRoutingModule {}
