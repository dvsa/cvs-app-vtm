import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { TechRecordCreateRoutes } from '@models/routes.enum';
import { techRecordDataResolver } from 'src/app/resolvers/tech-record-data/tech-record-data.resolver';

export const routes: Routes = [
	{
		path: '',
		resolve: { data: techRecordDataResolver },
		canActivate: [MsalGuard, RoleGuard],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./create-wrapper/create-tech-record-wrapper.component').then(
						(m) => m.CreateTechRecordWrapperComponent
					),
				data: { roles: Roles.TechRecordCreate },
				children: [],
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
			{
				path: TechRecordCreateRoutes.DUPLICATE_VIN,
				loadComponent: () =>
					import('../components/duplicate-vin/duplicate-vin.component').then((m) => m.DuplicateVinComponent),
				data: { roles: Roles.TechRecordCreate },
			},
		],
	},
];
