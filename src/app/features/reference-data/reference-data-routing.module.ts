import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { ReferenceDataComponent } from './reference-data.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: ReferenceDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferenceDataRoutingModule {}
