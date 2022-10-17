import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefectSelectComponent } from '@forms/components/defect-select/defect-select.component';
import { DefectComponent } from '@forms/custom-sections/defect/defect.component';
import { CancelEditTestGuard } from '@guards/cancel-edit-test/cancel-edit-test.guard';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { DefectsTaxonomyResolver } from 'src/app/resolvers/defects-taxonomy/defects-taxonomy.resolver';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { TestTypeTaxonomyResolver } from 'src/app/resolvers/test-type-taxonomy/test-type-taxonomy.resolver';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestAmendReasonComponent } from './views/test-amend-reason/test-amend-reason.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { TestResultSummaryComponent } from './views/test-result-summary/test-result-summary.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';
import { TestTypeSelectWrapperComponent } from './views/test-type-select-wrapper/test-type-select-wrapper.component';

const routes: Routes = [
  {
    path: '',
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
            component: TestRouterOutletComponent,
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
            component: TestRouterOutletComponent,
            data: { title: 'Test details', roles: Roles.TestResultAmend },
            resolve: { load: TestResultResolver, testTypeTaxonomy: TestTypeTaxonomyResolver, defectTaxonomy: DefectsTaxonomyResolver },
            canActivate: [RoleGuard],
            canDeactivate: [CancelEditTestGuard],
            children: [
              {
                path: '',
                component: TestRecordComponent
              },
              {
                path: 'defect/:defectIndex',
                component: DefectComponent,
                data: { title: 'Defect', roles: Roles.TestResultAmend, isEditing: true },
                canActivate: [RoleGuard]
              },
              {
                path: 'selectDefect',
                component: TestRouterOutletComponent,
                data: { title: 'Select Defect', roles: Roles.TestResultAmend },
                canActivate: [RoleGuard],
                children: [
                  {
                    path: '',
                    component: DefectSelectComponent
                  },
                  {
                    path: ':ref',
                    component: DefectComponent,
                    data: { title: 'Defect', roles: Roles.TestResultAmend, isEditing: true },
                    canActivate: [RoleGuard]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'amended/:createdAt',
        component: AmendedTestRecordComponent,
        data: { title: 'Amended test result', roles: Roles.TestResultView },
        canActivate: [RoleGuard]
      },
      {
        path: 'defect/:defectIndex',
        component: DefectComponent,
        data: { title: 'Defect', roles: Roles.TestResultView, isEditing: false },
        resolve: { load: TestResultResolver },
        canActivate: [RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmendTestRecordsRoutingModule {}
