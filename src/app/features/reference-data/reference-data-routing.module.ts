import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { ReferenceDataCreateComponent } from './reference-data-add/reference-data-add.component';
import { ReferenceDataAmendComponent } from './reference-data-amend/reference-data-amend.component';
import { ReferenceDataDeleteComponent } from './reference-data-delete/reference-data-delete.component';
import { ReferenceDataDeletedListComponent } from './reference-data-deleted-list/reference-data-deleted-list.component';
import { ReferenceDataListComponent } from './reference-data-list/reference-data-list.component';
import { ReferenceDataSelectTypeComponent } from './reference-data-select-type/reference-data-select-type.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { title: 'Select Reference Data Type', roles: Roles.ReferenceDataView },
    canActivate: [MsalGuard, RoleGuard],
    children: [
      {
        path: '',
        component: ReferenceDataSelectTypeComponent,
        data: { title: 'Select Reference Data Type', roles: Roles.ReferenceDataView },
        canActivate: [MsalGuard, RoleGuard]
      },
      {
        path: ':type',
        component: RouterOutletComponent,
        data: { title: 'Search Reference Data', roles: Roles.ReferenceDataView },
        canActivate: [MsalGuard, RoleGuard],
        children: [
          {
            path: '',
            component: ReferenceDataListComponent,
            data: { title: 'Search Reference Data', roles: Roles.ReferenceDataView },
            canActivate: [MsalGuard, RoleGuard]
          },
          {
            path: 'create',
            component: ReferenceDataCreateComponent,
            data: { title: 'Add Reference Data', roles: Roles.ReferenceDataAmend },
            canActivate: [MsalGuard, RoleGuard]
          },
          {
            path: 'deleted-items',
            component: ReferenceDataDeletedListComponent,
            data: { title: 'View deleted Reference Data', roles: Roles.ReferenceDataView },
            canActivate: [MsalGuard, RoleGuard]
          },
          {
            path: ':key',
            component: ReferenceDataAmendComponent,
            data: { title: 'Amend Reference Data', roles: Roles.ReferenceDataAmend },
            canActivate: [MsalGuard, RoleGuard]
          },
          {
            path: ':key/delete',
            component: ReferenceDataDeleteComponent,
            data: { title: 'Delete Reference Data', roles: Roles.ReferenceDataAmend },
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
export class ReferenceDataRoutingModule {}
