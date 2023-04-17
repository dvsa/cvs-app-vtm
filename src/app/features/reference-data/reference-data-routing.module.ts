import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { AddReferenceDataComponent } from './add-reference-data/add-reference-data.component';
import { DataTypeListComponent } from './data-type-list/data-type-list.component';
import { ReferenceDataComponent } from './reference-data.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ReferenceDataComponent
  },
  {
    path: 'data-type-list',
    component: DataTypeListComponent,
    data: { title: 'View Reference Data', roles: Roles.ReferenceDataView },
    canActivate: [MsalGuard, RoleGuard]
  },
  {
    path: 'data-type-list/add-reference-data',
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
