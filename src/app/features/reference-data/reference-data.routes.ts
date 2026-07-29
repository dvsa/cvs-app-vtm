import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { ReferenceDataRoutes } from '@models/routes.enum';
import { defectsTaxonomyResolver } from '../../resolvers/defects-taxonomy/defects-taxonomy.resolver';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('@components/router-outlet/router-outlet.component').then((m) => m.RouterOutletComponent),
		data: { title: 'Select Reference Data Type', roles: Roles.ReferenceDataView },
		canActivate: [MsalGuard, RoleGuard],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./reference-data-select-type/reference-data-select-type.component').then(
						(m) => m.ReferenceDataSelectTypeComponent
					),
				data: { title: 'Select reference data type', roles: Roles.ReferenceDataView },
				canActivate: [MsalGuard, RoleGuard],
			},
			{
				path: ReferenceDataRoutes.DEFECTS,
				data: { title: 'Defect categories', roles: Roles.ReferenceDataView, breadcrumbPreserveQueryParams: true },
				canActivate: [MsalGuard, RoleGuard],
				resolve: { defects: defectsTaxonomyResolver },
				children: [
					{
						path: '',
						pathMatch: 'full',
						data: { title: 'Defect categories', roles: Roles.ReferenceDataView, breadcrumbPreserveQueryParams: true },
						loadComponent: () =>
							import('./defect-categories-list/defect-categories-list.component').then((m) => m.DefectsListComponent),
					},
					{
						path: 'create',
						data: {
							title: 'Create defect category',
							roles: Roles.ReferenceDataAmend,
							breadcrumbPreserveQueryParams: true,
						},
						loadComponent: () =>
							import('./defect-category-create/defect-category-create.component').then(
								(m) => m.DefectCategoryCreateComponent
							),
					},
					{
						path: 'deleted-items',
						data: {
							title: 'Deleted defect categories',
							roles: Roles.ReferenceDataView,
							breadcrumbPreserveQueryParams: true,
						},
						loadComponent: () =>
							import('./defect-category-deleted-items/defect-category-deleted-items.component').then(
								(m) => m.DefectCategoryDeletedItemsComponent
							),
					},
					{
						path: ':imNumber/amend',
						pathMatch: 'full',
						data: {
							title: 'Amend defect category',
							roles: Roles.ReferenceDataAmend,
							breadcrumbPreserveQueryParams: true,
						},
						loadComponent: () =>
							import('./defect-category-amend/defect-category-amend.component').then(
								(m) => m.DefectCategoryAmendComponent
							),
					},
					{
						path: ':imNumber/delete',
						pathMatch: 'full',
						data: {
							title: 'Delete defect category',
							roles: Roles.ReferenceDataAmend,
							breadcrumbPreserveQueryParams: true,
						},
						loadComponent: () =>
							import('./defect-category-delete/defect-category-delete.component').then(
								(m) => m.DefectCategoryDeleteComponent
							),
					},
					{
						path: ':imNumber',
						data: { title: 'Defect items', roles: Roles.ReferenceDataAmend },
						children: [
							{
								path: 'create',
								data: {
									title: 'Create defect item',
									roles: Roles.ReferenceDataAmend,
									breadcrumbPreserveQueryParams: true,
								},
								loadComponent: () =>
									import('./defect-item-create/defect-item-create.component').then((m) => m.DefectItemCreateComponent),
							},
							{
								path: 'deleted-items',
								data: {
									title: 'Deleted defect items',
									roles: Roles.ReferenceDataView,
									breadcrumbPreserveQueryParams: true,
								},
								loadComponent: () =>
									import('./defect-item-deleted-items/defect-item-deleted-items.component').then(
										(m) => m.DefectItemDeletedItemsComponent
									),
							},
							{
								path: '',
								pathMatch: 'full',
								data: { title: 'Defect items', roles: Roles.ReferenceDataView, breadcrumbPreserveQueryParams: true },
								loadComponent: () =>
									import('./defect-items-list/defect-items-list.component').then((m) => m.DefectItemsListComponent),
							},
							{
								path: ':itemNumber/create',
								data: {
									title: 'Create defect deficiency',
									roles: Roles.ReferenceDataAmend,
									breadcrumbPreserveQueryParams: true,
								},
								loadComponent: () =>
									import('./defect-deficiency-create/defect-deficiency-create.component').then(
										(m) => m.DefectDeficiencyCreateComponent
									),
							},
							{
								path: ':itemNumber',
								data: {
									title: 'Defect deficiencies',
									roles: Roles.ReferenceDataView,
									breadcrumbPreserveQueryParams: true,
								},
								children: [
									{
										path: '',
										pathMatch: 'full',
										data: {
											title: 'Defect deficiencies',
											roles: Roles.ReferenceDataView,
											breadcrumbPreserveQueryParams: true,
										},
										loadComponent: () =>
											import('./defect-deficiencies-list/defect-deficiencies-list.component').then(
												(m) => m.DefectDeficienciesListComponent
											),
									},
									{
										path: 'create',
										pathMatch: 'full',
										data: { title: 'Create', roles: Roles.ReferenceDataAmend, breadcrumbPreserveQueryParams: true },
										loadComponent: () =>
											import('./defect-deficiency-create/defect-deficiency-create.component').then(
												(m) => m.DefectDeficiencyCreateComponent
											),
									},
									{
										path: 'amend',
										data: { title: 'Amend', roles: Roles.ReferenceDataAmend, breadcrumbPreserveQueryParams: true },
										loadComponent: () =>
											import('./defect-item-amend/defect-item-amend.component').then((m) => m.DefectItemAmendComponent),
									},
									{
										path: 'deleted-items',
										data: {
											title: 'Deleted defect deficiencies',
											roles: Roles.ReferenceDataView,
											breadcrumbPreserveQueryParams: true,
										},
										loadComponent: () =>
											import('./defect-deficiency-deleted-items/defect-deficiency-deleted-items.component').then(
												(m) => m.DefectDeficiencyDeletedItemsComponent
											),
									},
									{
										path: ':ref',
										data: { title: 'Amend', roles: Roles.ReferenceDataAmend, breadcrumbPreserveQueryParams: true },
										children: [
											{
												path: 'amend',
												data: { title: 'Amend', roles: Roles.ReferenceDataAmend, breadcrumbPreserveQueryParams: true },
												loadComponent: () =>
													import('./defect-deficiency-amend/defect-deficiency-amend.component').then(
														(m) => m.DefectDeficiencyAmendComponent
													),
											},
											{
												path: 'delete',
												data: { title: 'Delete', roles: Roles.ReferenceDataAmend, breadcrumbPreserveQueryParams: true },
												loadComponent: () =>
													import('./defect-deficiency-amend/defect-deficiency-amend.component').then(
														(m) => m.DefectDeficiencyAmendComponent
													),
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				path: ReferenceDataRoutes.TYPE,
				loadComponent: () =>
					import('@components/router-outlet/router-outlet.component').then((m) => m.RouterOutletComponent),
				data: { title: 'Search Reference Data', roles: Roles.ReferenceDataView },
				canActivate: [MsalGuard, RoleGuard],
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./reference-data-list/reference-data-list.component').then((m) => m.ReferenceDataListComponent),
						data: { title: 'Search Reference Data', roles: Roles.ReferenceDataView },
						canActivate: [MsalGuard, RoleGuard],
					},
					{
						path: ReferenceDataRoutes.CREATE,
						loadComponent: () =>
							import('./reference-data-add/reference-data-add.component').then((m) => m.ReferenceDataCreateComponent),
						data: { title: 'Add Reference Data', roles: Roles.ReferenceDataAmend },
						canActivate: [MsalGuard, RoleGuard],
					},
					{
						path: ReferenceDataRoutes.DELETED_ITEMS,
						loadComponent: () =>
							import('./reference-data-deleted-list/reference-data-deleted-list.component').then(
								(m) => m.ReferenceDataDeletedListComponent
							),
						data: { title: 'View deleted Reference Data', roles: Roles.ReferenceDataView },
						canActivate: [MsalGuard, RoleGuard],
					},
					{
						path: ReferenceDataRoutes.KEY,
						loadComponent: () =>
							import('./reference-data-amend/reference-data-amend.component').then(
								(m) => m.ReferenceDataAmendComponent
							),
						data: { title: 'Amend Reference Data', roles: Roles.ReferenceDataAmend },
						canActivate: [MsalGuard, RoleGuard],
					},
					{
						path: ReferenceDataRoutes.DELETE,
						loadComponent: () =>
							import('./reference-data-delete/reference-data-delete.component').then(
								(m) => m.ReferenceDataDeleteComponent
							),
						data: { title: 'Delete Reference Data', roles: Roles.ReferenceDataAmend },
						canActivate: [MsalGuard, RoleGuard],
					},
				],
			},
		],
	},
];
