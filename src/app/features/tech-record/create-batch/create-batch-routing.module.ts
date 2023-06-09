import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { BatchVehicleDetailsComponent } from './components/batch-vehicle-details/batch-vehicle-details.component';
import { BatchVehicleResultsComponent } from './components/batch-vehicle-results/batch-vehicle-results.component';
import { BatchVehicleTemplateComponent } from './components/batch-vehicle-template/batch-vehicle-template.component';
import { TechRecordSearchTyresComponent } from '../components/tech-record-search-tyres/tech-record-search-tyres.component';
import { SelectVehicleTypeComponent } from './components/select-vehicle-type/select-vehicle-type.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { roles: Roles.TechRecordCreate },
    canActivate: [MsalGuard, RoleGuard],
    children: [
      {
        path: '',
        component: SelectVehicleTypeComponent,
        data: { roles: Roles.TechRecordCreate },
        canActivate: [MsalGuard, RoleGuard]
      },
      {
        path: ':vehicleType',
        component: RouterOutletComponent,
        data: { title: 'Batch Record', roles: Roles.TechRecordCreate, isCustomLayout: true },
        children: [
          {
            path: '',
            component: BatchVehicleTemplateComponent,
            data: { title: 'Batch Record', roles: Roles.TechRecordCreate, isCustomLayout: true }
            //resolve: [CreateBatchResolver]
          },
          {
            path: 'details',
            component: BatchVehicleDetailsComponent,
            data: { title: 'Add batch of vehicles', roles: Roles.TechRecordCreate }
          },
          {
            path: 'batch-results',
            data: { title: 'Batch summary' },
            component: BatchVehicleResultsComponent
          },
          {
            path: 'tyre-search/:axleNumber',
            component: TechRecordSearchTyresComponent,
            data: { title: 'Tyre search', roles: Roles.TechRecordCreate, isEditing: true },
            canActivate: [MsalGuard, RoleGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateBatchRoutingModule {}
