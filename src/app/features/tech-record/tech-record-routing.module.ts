import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TechRecordComponent } from './tech-record.component';

const routes: Routes = [
  {
    path: ':vin',
    component: TechRecordComponent
    // canActivateChild: [MsalGuard],
  },
  {
    path: ':vin/:techCreatedAt',
    component: TechRecordComponent,
    data: { title: 'Tech Record' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
