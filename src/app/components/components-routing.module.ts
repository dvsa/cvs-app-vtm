import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TechnicalRecordComponent } from "@app/components/technical-record/technical-record.component";

const secondaryRoutes: Routes = [
  { path: 'technical-record', component: TechnicalRecordComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(secondaryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ComponentsRoutingModule { }
