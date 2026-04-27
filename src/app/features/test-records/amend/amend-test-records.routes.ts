import { DefectMediaService } from '@/src/app/services/defect-media-service/defect-media-service.service';
import { Routes } from '@angular/router';
import { CancelEditTestGuard } from '@guards/cancel-edit-test/cancel-edit-test.guard';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TestRecordAmendRoutes } from '@models/routes.enum';
import { loadingResolver } from '@resolvers/loading/loading.resolver';
import { defectsTaxonomyResolver } from 'src/app/resolvers/defects-taxonomy/defects-taxonomy.resolver';
import { requiredStandardsResolver } from 'src/app/resolvers/required-standards/required-standards.resolver';
import { testResultResolver } from 'src/app/resolvers/test-result/test-result.resolver';
import { testTypeTaxonomyResolver } from 'src/app/resolvers/test-type-taxonomy/test-type-taxonomy.resolver';

export const routes: Routes = [
	{
		path: '',
		providers: [DefectMediaService],
		loadComponent: () =>
			import('./views/test-router-outlet/test-router-outlet.component').then((m) => m.TestRouterOutletComponent),
		resolve: { load: testResultResolver, testTypeTaxonomy: testTypeTaxonomyResolver },
		children: [
			{
				path: '',
				title: 'View test record - Vehicle Testing Management',
				loadComponent: () =>
					import('./views/test-result-summary/test-result-summary.component').then((m) => m.TestResultSummaryComponent),
			},
			{
				path: TestRecordAmendRoutes.AMEND_TEST,
				loadComponent: () =>
					import('./views/test-router-outlet/test-router-outlet.component').then((m) => m.TestRouterOutletComponent),
				data: { title: 'Amend test record', roles: Roles.TestResultAmend },
				canActivate: [RoleGuard],
				children: [
					{
						path: '',
						title: 'Amend test record reason - Vehicle Testing Management',
						loadComponent: () =>
							import('./views/test-amend-reason/test-amend-reason.component').then((m) => m.TestAmendReasonComponent),
					},
					{
						path: TestRecordAmendRoutes.INCORRECT_TEST_TYPE,
						loadComponent: () =>
							import('./views/test-router-outlet/test-router-outlet.component').then(
								(m) => m.TestRouterOutletComponent
							),
						data: { title: 'Select a test type', roles: Roles.TestResultAmend },
						resolve: { testTypeTaxonomy: testTypeTaxonomyResolver },
						canActivate: [RoleGuard],
						children: [
							{
								path: '',
								loadComponent: () =>
									import('./views/test-type-select-wrapper/test-type-select-wrapper.component').then(
										(m) => m.TestTypeSelectWrapperComponent
									),
							},
						],
					},
					{
						path: TestRecordAmendRoutes.TEST_DETAILS,
						loadComponent: () =>
							import('./views/test-router-outlet/test-router-outlet.component').then(
								(m) => m.TestRouterOutletComponent
							),
						data: { title: 'Amend test details', roles: Roles.TestResultAmend, mode: 'amend' },
						resolve: {
							load: testResultResolver,
							testTypeTaxonomy: testTypeTaxonomyResolver,
							defectTaxonomy: defectsTaxonomyResolver,
							loading: loadingResolver,
						},
						canActivate: [RoleGuard],
						canDeactivate: [CancelEditTestGuard],
						children: [
							{
								path: '',
								loadComponent: () =>
									import('@features/test-records/amend/views/test-record-wrapper/test-record-wrapper.component').then(
										(m) => m.TestRecordWrapperComponent
									),
							},
							{
								path: TestRecordAmendRoutes.DEFECT,
								loadComponent: () =>
									import('@forms/custom-sections/defect/defect.component').then((m) => m.DefectComponent),
								data: { title: 'Defect details', roles: Roles.TestResultAmend, isEditing: true },
								canActivate: [RoleGuard],
							},
							{
								path: TestRecordAmendRoutes.SELECT_DEFECT,
								loadComponent: () =>
									import('./views/test-router-outlet/test-router-outlet.component').then(
										(m) => m.TestRouterOutletComponent
									),
								data: { title: 'Select a defect', roles: Roles.TestResultAmend },
								canActivate: [RoleGuard],
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
										path: TestRecordAmendRoutes.SELECT_DEFECT_REFERENCE,
										loadComponent: () =>
											import('@forms/custom-sections/defect/defect.component').then((m) => m.DefectComponent),
										data: { title: 'Defect details', roles: Roles.TestResultAmend, isEditing: true },
										canActivate: [RoleGuard],
									},
								],
							},
							{
								path: TestRecordAmendRoutes.REQUIRED_STANDARD,
								loadComponent: () =>
									import('@forms/custom-sections/required-standard/required-standard.component').then(
										(m) => m.RequiredStandardComponent
									),
								data: { title: 'Required Standard', roles: Roles.TestResultAmend, isEditing: true },
								canActivate: [RoleGuard],
							},
							{
								path: TestRecordAmendRoutes.SELECT_REQUIRED_STANDARD,
								loadComponent: () =>
									import('./views/test-router-outlet/test-router-outlet.component').then(
										(m) => m.TestRouterOutletComponent
									),
								resolve: { RequiredStandards: requiredStandardsResolver, loading: loadingResolver },
								data: { title: 'Select Required Standard', roles: Roles.TestResultAmend },
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
										path: TestRecordAmendRoutes.REQUIRED_STANDARD_REF,
										loadComponent: () =>
											import('@forms/custom-sections/required-standard/required-standard.component').then(
												(m) => m.RequiredStandardComponent
											),
										data: { title: 'Required Standard', roles: Roles.TestResultAmend, isEditing: true },
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
				loadComponent: () =>
					import('./views/amended-test-record/amended-test-record.component').then((m) => m.AmendedTestRecordComponent),
				data: { title: 'Amended test result', roles: Roles.TestResultView },
				canActivate: [RoleGuard],
			},
			{
				path: TestRecordAmendRoutes.CANCEL_TEST,
				loadComponent: () =>
					import('./views/confirm-cancellation/confirm-cancellation.component').then(
						(m) => m.ConfirmCancellationComponent
					),
				data: { title: 'Cancel test result', roles: Roles.TestResultAmend },
				canActivate: [RoleGuard],
			},
			{
				path: TestRecordAmendRoutes.DEFECT,
				loadComponent: () => import('@forms/custom-sections/defect/defect.component').then((m) => m.DefectComponent),
				data: { title: 'Defect details', roles: Roles.TestResultView, isEditing: false },
				resolve: { load: testResultResolver },
				canActivate: [RoleGuard],
			},
			{
				path: TestRecordAmendRoutes.REQUIRED_STANDARD,
				loadComponent: () =>
					import('@forms/custom-sections/required-standard/required-standard.component').then(
						(m) => m.RequiredStandardComponent
					),
				data: { title: 'Required Standard', roles: Roles.TestResultView, isEditing: false },
				resolve: { load: testResultResolver },
				canActivate: [RoleGuard],
			},
		],
	},
];
