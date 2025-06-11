import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { ReferenceDataRoutes } from '@models/routes.enum';

const routes: Routes = [
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
				data: { title: 'Select Reference Data Type', roles: Roles.ReferenceDataView },
				canActivate: [MsalGuard, RoleGuard],
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
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ReferenceDataRoutingModule {}
