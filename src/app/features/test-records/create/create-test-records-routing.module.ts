import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefectSelectComponent } from '@forms/components/defect-select/defect-select.component';
import { RequiredStandardSelectComponent } from '@forms/components/required-standard-select/required-standard-select.component';
import { DefectComponent } from '@forms/custom-sections/defect/defect.component';
import { RequiredStandardComponent } from '@forms/custom-sections/required-standard/required-standard.component';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { contingencyTestResolver } from 'src/app/resolvers/contingency-test/contingency-test.resolver';
import { defectsTaxonomyResolver } from 'src/app/resolvers/defects-taxonomy/defects-taxonomy.resolver';
import { requiredStandardsResolver } from 'src/app/resolvers/required-standards/required-standards.resolver';
import { testStationsResolver } from 'src/app/resolvers/test-stations/test-stations.resolver';
import { testTypeTaxonomyResolver } from 'src/app/resolvers/test-type-taxonomy/test-type-taxonomy.resolver';
import { CreateTestRecordComponent } from './views/create-test-record/create-test-record.component';
import { CreateTestTypeComponent } from './views/create-test-type/create-test-type.component';
import { TestRouterOutletComponent } from './views/test-router-outlet/test-router-outlet.component';

const routes: Routes = [
  {
    path: '',
    component: TestRouterOutletComponent,
    resolve: { contingencyTest: contingencyTestResolver },
    children: [
      {
        path: '',
        redirectTo: 'type',
      },
      {
        path: 'type',
        component: CreateTestTypeComponent,
        resolve: { testTypeTaxonomy: testTypeTaxonomyResolver, contingencyTest: contingencyTestResolver },
      },
      {
        path: 'test-details',
        component: TestRouterOutletComponent,
        resolve: { TestTypeTaxonomy: testTypeTaxonomyResolver, defectTaxonomy: defectsTaxonomyResolver, testStations: testStationsResolver },
        data: { title: 'Test details', roles: Roles.TestResultCreateContingency, breadcrumbPreserveQueryParams: true },
        canActivate: [RoleGuard],
        children: [
          {
            path: '',
            component: CreateTestRecordComponent,
          },
          {
            path: 'defect/:defectIndex',
            component: DefectComponent,
            data: { title: 'Defect', roles: Roles.TestResultCreateContingency, isEditing: true },
            canActivate: [RoleGuard],
          },
          {
            path: 'selectDefect',
            component: TestRouterOutletComponent,
            data: { title: 'Select defect', roles: Roles.TestResultCreateContingency },
            children: [
              {
                path: '',
                component: DefectSelectComponent,
                canActivate: [RoleGuard],
              },
              {
                path: ':ref',
                component: DefectComponent,
                data: { title: 'Defect', roles: Roles.TestResultCreateContingency, isEditing: true },
                canActivate: [RoleGuard],
              },
            ],
          },
          {
            path: 'selectRequiredStandard',
            component: TestRouterOutletComponent,
            resolve: { RequiredStandards: requiredStandardsResolver },
            data: { title: 'Select Required Standard', roles: Roles.TestResultCreateContingency },
            children: [
              {
                path: '',
                component: RequiredStandardSelectComponent,
                canActivate: [RoleGuard],
              },
              {
                path: ':ref',
                component: RequiredStandardComponent,
                data: { title: 'Required Standard', roles: Roles.TestResultCreateContingency, isEditing: true },
                canActivate: [RoleGuard],
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTestRecordsRoutingModule {}
