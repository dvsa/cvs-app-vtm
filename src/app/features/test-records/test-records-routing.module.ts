import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoEditGuard } from '@guards/no-edit/no-edit.guard';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { ContingencyTestResolver } from 'src/app/resolvers/contingency-test/contingency-test.resolver';
import { DefectsTaxonomyResolver } from 'src/app/resolvers/defects-taxonomy/defects-taxonomy.resolver';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { TestTypeTaxonomyResolver } from 'src/app/resolvers/test-type-taxonomy/test-type-taxonomy.resolver';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { CreateTestRecordComponent } from './views/create-test-record/create-test-record.component';
import { CreateTestTypeComponent } from './views/create-test-type/create-test-type.component';
import { IncorrectTestTypeComponent } from './views/incorrect-test-type/incorrect-test-type.component';
import { TestAmendReasonComponent } from './views/test-amend-reason/test-amend-reason.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { TestResultSummaryComponent } from './views/test-result-summary/test-result-summary.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';
import { TestTypeSelectWrapperComponent } from './views/test-type-select-wrapper/test-type-select-wrapper.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'test-result/:testResultId/:testNumber',
        data: { title: 'Test record', roles: Roles.TestResultView },
        canActivate: [RoleGuard],
        component: TestRouterOutletComponent,
        resolve: { load: TestResultResolver, testTypeTaxonomy: TestTypeTaxonomyResolver },
        children: [
          {
            path: '',
            component: TestResultSummaryComponent
          },
          {
            path: 'amend-test',
            component: TestRouterOutletComponent,
            data: { title: 'Amend test record', roles: Roles.TestResultAmend },
            canActivate: [RoleGuard],
            children: [
              {
                path: '',
                component: TestAmendReasonComponent
              },
              {
                path: 'incorrect-test-type',
                component: IncorrectTestTypeComponent,
                data: { title: 'Select a test type', roles: Roles.TestResultAmend },
                resolve: { testTypeTaxonomy: TestTypeTaxonomyResolver },
                canActivate: [RoleGuard],
                children: [
                  {
                    path: '',
                    component: TestTypeSelectWrapperComponent
                  }
                ]
              },
              {
                path: 'amend-test-details',
                component: TestRecordComponent,
                data: { title: 'Test details', roles: Roles.TestResultAmend },
                resolve: { load: TestResultResolver, testTypeTaxonomy: TestTypeTaxonomyResolver, defectTaxonomy: DefectsTaxonomyResolver },
                canActivate: [RoleGuard]
              }
            ]
          },
          {
            path: 'amended/:createdAt',
            component: AmendedTestRecordComponent,
            data: { title: 'Amended test result' },
            canActivate: [NoEditGuard]
          }
        ]
      },
      {
        path: 'create-test',
        component: TestRouterOutletComponent,
        resolve: { contingencyTest: ContingencyTestResolver },
        children: [
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRecordsRoutingModule {}
