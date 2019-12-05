import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TechnicalRecordComponent} from '../components/technical-record/technical-record.component';
import { AuthenticationGuard } from 'microsoft-adal-angular6';

const secondaryRoutes: Routes = [
  // {path: 'search', component: TechnicalRecordSearchComponent,  canActivate: [AuthenticationGuard]},
  {path: 'technical-record', component: TechnicalRecordComponent,  canActivate: [AuthenticationGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(secondaryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ComponentsRoutingModule {
}
