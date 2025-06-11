import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TestRecordCreateRoutes } from '@models/routes.enum';
import { loadingResolver } from '@resolvers/loading/loading.resolver';
import { recallsResolver } from '@resolvers/recalls/recalls.resolver';
import { contingencyTestResolver } from 'src/app/resolvers/contingency-test/contingency-test.resolver';
import { defectsTaxonomyResolver } from 'src/app/resolvers/defects-taxonomy/defects-taxonomy.resolver';
import { requiredStandardsResolver } from 'src/app/resolvers/required-standards/required-standards.resolver';
import { testCodeResolver } from 'src/app/resolvers/test-code/test-code.resolver';
import { testStationsResolver } from 'src/app/resolvers/test-stations/test-stations.resolver';
import { testTypeTaxonomyResolver } from 'src/app/resolvers/test-type-taxonomy/test-type-taxonomy.resolver';

const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./views/test-router-outlet/test-router-outlet.component').then((m) => m.TestRouterOutletComponent),
		resolve: { contingencyTest: contingencyTestResolver },
		children: [
			{
				path: '',
				redirectTo: 'type',
			},
			{
				path: TestRecordCreateRoutes.TYPE,
				loadComponent: () =>
					import('./views/create-test-type/create-test-type.component').then((m) => m.CreateTestTypeComponent),
				resolve: { testTypeTaxonomy: testTypeTaxonomyResolver, contingencyTest: contingencyTestResolver },
			},
			{
				path: TestRecordCreateRoutes.TEST_DETAILS,
				loadComponent: () =>
					import('./views/test-router-outlet/test-router-outlet.component').then((m) => m.TestRouterOutletComponent),
				resolve: {
					TestTypeTaxonomy: testTypeTaxonomyResolver,
					defectTaxonomy: defectsTaxonomyResolver,
					testStations: testStationsResolver,
					testCode: testCodeResolver,
					recalls: recallsResolver,
					loading: loadingResolver,
				},
				data: {
					title: 'Test details',
					roles: Roles.TestResultCreateContingency,
					breadcrumbPreserveQueryParams: true,
					mode: 'create',
				},
				canActivate: [RoleGuard],
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./views/create-test-record/create-test-record.component').then(
								(m) => m.CreateTestRecordComponent
							),
					},
					{
						path: TestRecordCreateRoutes.DEFECT,
						loadComponent: () =>
							import('@forms/custom-sections/defect/defect.component').then((m) => m.DefectComponent),
						data: { title: 'Defect', roles: Roles.TestResultCreateContingency, isEditing: true },
						canActivate: [RoleGuard],
					},
					{
						path: TestRecordCreateRoutes.SELECT_DEFECT,
						loadComponent: () =>
							import('./views/test-router-outlet/test-router-outlet.component').then(
								(m) => m.TestRouterOutletComponent
							),
						data: { title: 'Select defect', roles: Roles.TestResultCreateContingency },
						children: [
							{
								path: '',
								loadComponent: () =>
									import('@forms/components/defect-select/defect-select.component').then(
										(m) => m.DefectSelectComponent
									),
								canActivate: [RoleGuard],
							},
							{
								path: TestRecordCreateRoutes.SELECT_DEFECT_REF,
								loadComponent: () =>
									import('@forms/custom-sections/defect/defect.component').then((m) => m.DefectComponent),
								data: { title: 'Defect', roles: Roles.TestResultCreateContingency, isEditing: true },
								canActivate: [RoleGuard],
							},
						],
					},
					{
						path: TestRecordCreateRoutes.REQUIRED_STANDARD,
						loadComponent: () =>
							import('@forms/custom-sections/required-standard/required-standard.component').then(
								(m) => m.RequiredStandardComponent
							),
						data: { title: 'Required Standard', roles: Roles.TestResultCreateContingency, isEditing: true },
						canActivate: [RoleGuard],
					},
					{
						path: TestRecordCreateRoutes.SELECT_REQUIRED_STANDARD,
						loadComponent: () =>
							import('./views/test-router-outlet/test-router-outlet.component').then(
								(m) => m.TestRouterOutletComponent
							),
						resolve: { RequiredStandards: requiredStandardsResolver, loading: loadingResolver },
						data: { title: 'Select Required Standard', roles: Roles.TestResultCreateContingency },
						children: [
							{
								path: '',
								loadComponent: () =>
									import('@forms/components/required-standard-select/required-standard-select.component').then(
										(m) => m.RequiredStandardSelectComponent
									),
								canActivate: [RoleGuard],
							},
							{
								path: TestRecordCreateRoutes.REQUIRED_STANDARD_REF,
								loadComponent: () =>
									import('@forms/custom-sections/required-standard/required-standard.component').then(
										(m) => m.RequiredStandardComponent
									),
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
