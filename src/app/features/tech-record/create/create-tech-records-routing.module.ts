import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordCreateRoutes } from '@models/routes.enum';
import { techRecordDataResolver } from 'src/app/resolvers/tech-record-data/tech-record-data.resolver';

const routes: Routes = [
	{
		path: '',
		resolve: { data: techRecordDataResolver },
		canActivate: [MsalGuard, RoleGuard],
		children: [
			{
				path: '',
				loadComponent: () => import('./create-tech-record.component').then((m) => m.CreateTechRecordComponent),
				data: { roles: Roles.TechRecordCreate },
			},
			{
				path: TechRecordCreateRoutes.NEW_RECORD_DETAILS,
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./components/hydrate-new-vehicle-record/hydrate-new-vehicle-record.component').then(
								(m) => m.HydrateNewVehicleRecordComponent
							),
						data: {
							title: 'New record details',
							roles: Roles.TechRecordCreate,
							isCustomLayout: true,
							isEditing: true,
						},
					},
					{
						path: TechRecordCreateRoutes.TYRE_SEARCH,
						loadComponent: () =>
							import('../components/tech-record-search-tyres/tech-record-search-tyres.component').then(
								(m) => m.TechRecordSearchTyresComponent
							),
						data: { title: 'Tyre search', roles: Roles.TechRecordCreate, isEditing: true },
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
export class CreateTechRecordsRoutingModule {}
