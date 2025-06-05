import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordCreateBatchRoutes } from '@models/routes.enum';
import { techRecordDataResolver } from '@resolvers/tech-record-data/tech-record-data.resolver';

const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('@components/router-outlet/router-outlet.component').then((m) => m.RouterOutletComponent),
		data: { roles: Roles.TechRecordCreate },
		canActivate: [MsalGuard, RoleGuard],
		resolve: {
			data: techRecordDataResolver,
		},
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./components/select-vehicle-type/select-vehicle-type.component').then(
						(m) => m.SelectVehicleTypeComponent
					),
				data: { roles: Roles.TechRecordCreate },
				canActivate: [MsalGuard, RoleGuard],
			},
			{
				path: TechRecordCreateBatchRoutes.RECORD,
				loadComponent: () =>
					import('@components/router-outlet/router-outlet.component').then((m) => m.RouterOutletComponent),
				data: { title: 'Batch Record', roles: Roles.TechRecordCreate, isCustomLayout: true },
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./components/batch-vehicle-template/batch-vehicle-template.component').then(
								(m) => m.BatchVehicleTemplateComponent
							),
						data: {
							title: 'Batch Record',
							roles: Roles.TechRecordCreate,
							isCustomLayout: true,
							isEditing: true,
						},
					},
					{
						path: TechRecordCreateBatchRoutes.DETAILS,
						loadComponent: () =>
							import('./components/batch-vehicle-details/batch-vehicle-details.component').then(
								(m) => m.BatchVehicleDetailsComponent
							),
						data: { title: 'Add batch of vehicles', roles: Roles.TechRecordCreate, isEditing: true },
					},
					{
						path: TechRecordCreateBatchRoutes.BATCH_RESULT,
						data: { title: 'Batch summary' },
						loadComponent: () =>
							import('./components/batch-vehicle-results/batch-vehicle-results.component').then(
								(m) => m.BatchVehicleResultsComponent
							),
					},
					{
						path: TechRecordCreateBatchRoutes.TYRE_SEARCH,
						loadComponent: () =>
							import('../components/tech-record-search-tyres/tech-record-search-tyres.component').then(
								(m) => m.TechRecordSearchTyresComponent
							),
						data: { title: 'Tyre search', roles: Roles.TechRecordCreate, isEditing: true },
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
export class CreateBatchRoutingModule {}
