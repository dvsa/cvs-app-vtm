import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoEditGuard } from '@guards/no-edit/no-edit.guard';
import { TestResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { AmendedTestRecordComponent } from './views/amended-test-record/amended-test-record.component';
import { TestRecordComponent } from './views/test-record/test-record.component';
import { RoleGuard } from '@guards/roles.guard';
import { Roles } from '@models/roles.enum';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TestRecordComponent,
        resolve: { load: TestResultResolver }
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
