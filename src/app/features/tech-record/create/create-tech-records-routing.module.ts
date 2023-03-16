import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { TechRecordSearchTyresComponent } from '../components/tech-record-search-tyres/tech-record-search-tyres.component';
import { BatchCreateResultsComponent } from './components/batch-create-results/batch-create-results.component';
import { BatchCreateComponent } from './components/batch-create/batch-create.component';
import { GenerateBatchNumbersComponent } from './components/generate-batch-numbers/generate-batch-numbers.component';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { CreateTechRecordComponent } from './create-tech-record.component';

const routes: Routes = [
  {
    path: '',
    component: CreateTechRecordComponent,
    data: { roles: Roles.TechRecordCreate },
    canActivate: [MsalGuard, RoleGuard]
  },
  {
    path: 'new-record-details',
    component: RouterOutletComponent,
    data: { title: 'New record details', roles: Roles.TechRecordCreate, isCustomLayout: true },
    canActivate: [MsalGuard, RoleGuard],
    children: [
      {
        path: '',
        component: HydrateNewVehicleRecordComponent,
        canActivate: [MsalGuard, RoleGuard]
      },
      {
        path: 'generate-batch-numbers',
        component: GenerateBatchNumbersComponent
      },
      {
        path: 'add-batch',
        component: BatchCreateComponent,
        data: { tile: 'Batch Creation', roles: Roles.TechRecordCreate }
      },
      {
        path: 'batch-results',
        data: { tile: 'Batch results' },
        component: BatchCreateResultsComponent
      }
    ]
  },
  {
    path: 'new-record-details/tyre-search/:axleNumber',
    component: TechRecordSearchTyresComponent,
    data: { title: 'Tyre search', roles: Roles.TechRecordCreate, isEditing: true },
    canActivate: [MsalGuard, RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateTechRecordsRoutingModule {}
