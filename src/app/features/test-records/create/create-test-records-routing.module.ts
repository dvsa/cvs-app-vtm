import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { ContingencyTestResolver } from 'src/app/resolvers/contingency-test/contingency-test.resolver';
import { DefectsTaxonomyResolver } from 'src/app/resolvers/defects-taxonomy/defects-taxonomy.resolver';
import { TestTypeTaxonomyResolver } from 'src/app/resolvers/test-type-taxonomy/test-type-taxonomy.resolver';
import { CreateTestRecordComponent } from './views/create-test-record/create-test-record.component';
import { CreateTestTypeComponent } from './views/create-test-type/create-test-type.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';

const routes: Routes = [
  {
    path: '',
    component: TestRouterOutletComponent,
    resolve: { contingencyTest: ContingencyTestResolver },
    children: [
      {
        path: '',
        redirectTo: 'type'
      },
      {
        path: 'type',
        component: CreateTestTypeComponent,
        data: { title: 'Create contingency test' },
        resolve: { testTypeTaxonomy: TestTypeTaxonomyResolver }
      },
      {
        path: 'test-details',
        component: CreateTestRecordComponent,
        data: { title: 'Test details', roles: Roles.TestResultAmend },
        resolve: { testTypeTaxonomy: TestTypeTaxonomyResolver, defectTaxonomy: DefectsTaxonomyResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateTestRecordsRoutingModule {}
