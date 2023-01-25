import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordSearchTyresComponent } from '../tech-record/components/tech-record-search-tyres/tech-record-search-tyres.component';
import { HydrateNewVehicleRecordComponent } from './components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component';
import { CreateComponent } from './create.component';

const routes: Routes = [
  {
    path: '',
    component: CreateComponent,
    data: { roles: Roles.TechRecordCreate },
    canActivate: [MsalGuard, RoleGuard]
  },
  {
    path: 'new-record-details',
    component: HydrateNewVehicleRecordComponent,
    data: { title: 'New record details', roles: Roles.TechRecordCreate },
    canActivate: [MsalGuard, RoleGuard]
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
export class CreateRoutingModule {}
