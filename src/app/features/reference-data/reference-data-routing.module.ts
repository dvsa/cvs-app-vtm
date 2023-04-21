import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { AddReferenceDataComponent } from './reference-data-add/reference-data-add.component';
import { ReferenceDataListComponent } from './reference-data-list/reference-data-list.component';
import { ReferenceDataSelectTypeComponent } from './reference-data-select-type/reference-data-select-type.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ReferenceDataListComponent,
    data: { title: 'View Reference Data', roles: Roles.ReferenceDataView }
  },
  {
    path: 'select-type',
    component: ReferenceDataSelectTypeComponent,
    data: { title: 'Select Reference Data Type', roles: Roles.ReferenceDataView },
    canActivate: [MsalGuard, RoleGuard]
  },
  {
    path: 'add',
    component: AddReferenceDataComponent,
    data: { title: 'Add Reference Data', roles: Roles.ReferenceDataView },
    canActivate: [MsalGuard, RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferenceDataRoutingModule {}
