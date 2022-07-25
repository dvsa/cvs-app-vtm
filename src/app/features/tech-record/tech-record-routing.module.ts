import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TechRecordViewResolver } from 'src/app/resolvers/tech-record-view/tech-record-view.resolver';
import { TechRecordComponent } from './tech-record.component';

const routes: Routes = [
  {
    path: ':systemNumber',
    component: TechRecordComponent,
    canActivateChild: [MsalGuard],
    resolve: { load: TechRecordViewResolver }
  },
  {
    path: ':systemNumber/:techCreatedAt',
    component: TechRecordComponent,
    data: { title: 'Tech Record' },
    resolve: { load: TechRecordViewResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRecordsRoutingModule {}
