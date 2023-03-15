import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { TechRecordSearchTyresComponent } from '../components/tech-record-search-tyres/tech-record-search-tyres.component';
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
        path: 'add-batch',
        data: { tile: 'Batch Creation', roles: Roles.TechRecordCreate },
        loadChildren: () => import('./components/batch-create/batch-create.module').then(m => m.BatchCreateModule)
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
