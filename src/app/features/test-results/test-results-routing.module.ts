import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TestResultsComponent } from './test-results.component';
import { TestResultComponent } from './views/test-result/test-result.component';

const routes: Routes = [
  {
    path: '',
    component: TestResultsComponent,
    // canActivateChild: [MsalGuard],
    children: [
      {
        path: ':systemId',
        component: TestResultComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestResultsRoutingModule {}
