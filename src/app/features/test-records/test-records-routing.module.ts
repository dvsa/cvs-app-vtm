import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoEditGuard } from '@guards/no-edit/no-edit.guard';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';
import { TestResultSummaryComponent } from './views/test-result-summary/test-result-summary.component';
import { IncorrectTestTypeComponent } from './views/incorrect-test-type/incorrect-test-type.component';
import { AmendTestComponent } from './views/amend-test/amend-test.component';
import { TestAmendReasonComponent } from './views/test-amend-reason/test-amend-reason.component';
import { TestTypeSelectComponent } from './components/test-type-select/test-type-select.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TestResultSummaryComponent,
        resolve: { load: TestResultResolver }
      },
      {
        path: 'amend-test',
        component: AmendTestComponent,
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
            resolve: { load: TestResultResolver },
            canActivate: [RoleGuard],
            children: [
              {
                path: '',
                component: TestTypeSelectComponent
              }
            ]
          },
          {
            path: 'amend-test-details',
            component: TestRecordComponent,
            data: { title: 'Test details', roles: Roles.TestResultAmend },
            resolve: { load: TestResultResolver },
            canActivate: [RoleGuard]
          }
        ]
      },
      {
        path: 'amended/:createdAt',
        component: AmendedTestRecordComponent,
        data: { title: 'Amended Test Result', roles: Roles.TestResultAmend },
        resolve: { load: TestResultResolver },
        canActivate: [NoEditGuard, RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRecordsRoutingModule {}
