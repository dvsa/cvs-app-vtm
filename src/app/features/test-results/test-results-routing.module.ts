import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TestResultsComponent } from './test-results.component';
import { TestResultComponent } from './views/test-result/test-result.component';

const routes: Routes = [
  {
    path: ':systemId',
    component: TestResultsComponent,
    canActivateChild: [MsalGuard],
    children: [
      {
        path: 'test-result/:testResultId',
        component: TestResultComponent,
        data: {title: 'Test Result'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestResultsRoutingModule {}
