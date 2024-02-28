import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefectSelectComponent } from '@forms/components/defect-select/defect-select.component';
import { DefectComponent } from '@forms/custom-sections/defect/defect.component';
import { CancelEditTestGuard } from '@guards/cancel-edit-test/cancel-edit-test.guard';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { defectsTaxonomyResolver } from 'src/app/resolvers/defects-taxonomy/defects-taxonomy.resolver';
import { testResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { testTypeTaxonomyResolver } from 'src/app/resolvers/test-type-taxonomy/test-type-taxonomy.resolver';
import { TestRecordAmendRoutes } from '@models/routes.enum';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { ConfirmCancellationComponent } from './views/confirm-cancellation/confirm-cancellation.component';
import { TestAmendReasonComponent } from './views/test-amend-reason/test-amend-reason.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { TestResultSummaryComponent } from './views/test-result-summary/test-result-summary.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';
import { TestTypeSelectWrapperComponent } from './views/test-type-select-wrapper/test-type-select-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: TestRouterOutletComponent,
    resolve: { load: testResultResolver, testTypeTaxonomy: testTypeTaxonomyResolver },
    children: [
      {
        path: '',
        component: TestResultSummaryComponent,
      },
      {
        path: TestRecordAmendRoutes.AMEND_TEST,
        component: TestRouterOutletComponent,
        data: { title: 'Amend test record', roles: Roles.TestResultAmend },
        canActivate: [RoleGuard],
        children: [
          {
            path: '',
            component: TestAmendReasonComponent,
          },
          {
            path: TestRecordAmendRoutes.INCORRECT_TEST_TYPE,
            component: TestRouterOutletComponent,
            data: { title: 'Select a test type', roles: Roles.TestResultAmend },
            resolve: { testTypeTaxonomy: testTypeTaxonomyResolver },
            canActivate: [RoleGuard],
            children: [
              {
                path: '',
                component: TestTypeSelectWrapperComponent,
              },
            ],
          },
          {
            path: TestRecordAmendRoutes.TEST_DETAILS,
            component: TestRouterOutletComponent,
            data: { title: 'Test details', roles: Roles.TestResultAmend },
            resolve: { load: testResultResolver, testTypeTaxonomy: testTypeTaxonomyResolver, defectTaxonomy: defectsTaxonomyResolver },
            canActivate: [RoleGuard],
            canDeactivate: [CancelEditTestGuard],
            children: [
              {
                path: '',
                component: TestRecordComponent,
              },
              {
                path: TestRecordAmendRoutes.DEFECT,
                component: DefectComponent,
                data: { title: 'Defect', roles: Roles.TestResultAmend, isEditing: true },
                canActivate: [RoleGuard],
              },
              {
                path: TestRecordAmendRoutes.SELECT_DEFECT,
                component: TestRouterOutletComponent,
                data: { title: 'Select Defect', roles: Roles.TestResultAmend },
                canActivate: [RoleGuard],
                children: [
                  {
                    path: '',
                    component: DefectSelectComponent,
                    canActivate: [RoleGuard],
                  },
                  {
                    path: TestRecordAmendRoutes.SELECT_DEFECT_REFERENCE,
                    component: DefectComponent,
                    data: { title: 'Defect', roles: Roles.TestResultAmend, isEditing: true },
                    canActivate: [RoleGuard],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: TestRecordAmendRoutes.AMENDED_TEST,
        component: AmendedTestRecordComponent,
        data: { title: 'Amended test result', roles: Roles.TestResultView },
        canActivate: [RoleGuard],
      },
      {
        path: TestRecordAmendRoutes.CANCEL_TEST,
        component: ConfirmCancellationComponent,
        data: { title: 'Cancel test result', roles: Roles.TestResultAmend },
        canActivate: [RoleGuard],
      },
      {
        path: TestRecordAmendRoutes.DEFECT,
        component: DefectComponent,
        data: { title: 'Defect', roles: Roles.TestResultView, isEditing: false },
        resolve: { load: testResultResolver },
        canActivate: [RoleGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmendTestRecordsRoutingModule {}
