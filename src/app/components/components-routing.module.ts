import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TechnicalRecordComponent} from '../components/technical-record/technical-record.component';
import {TechnicalRecordSearchComponent} from './technical-record-search/technical-record-search.component';

const secondaryRoutes: Routes = [
  {path: 'search', component: TechnicalRecordSearchComponent},
  {path: 'technical-record', component: TechnicalRecordComponent}
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
