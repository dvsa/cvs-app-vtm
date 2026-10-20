import { AxlesService } from '@/src/app/services/axles/axles.service';
import { FeatureFlags } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { RootRoutes, TechRecordCreateRoutes } from '@models/routes.enum';
import { techRecordDataResolver } from '@resolvers/tech-record-data/tech-record-data.resolver';

export const routes: Routes = [
	{
		path: '',
		resolve: { data: techRecordDataResolver },
		canActivate: [MsalGuard, RoleGuard],
		canDeactivate: [
			() => {
				// Reset upon leaving the route
				const axleService = inject(AxlesService);
				axleService.reset();
			},
		],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./create-tech-record/create-tech-record.component').then((m) => m.CreateTechRecordComponent),
				data: {
					roles: Roles.TechRecordCreate,
					backlink: {
						url: RootRoutes.ROOT,
						featureFlags: [FeatureFlags.TECH_RECORD_REDESIGN_CREATE],
					},
				},
				children: [],
			},
			{
				path: TechRecordCreateRoutes.NEW_RECORD_DETAILS,
				children: [
					{
						path: '',
						loadComponent: () =>
							import(
								'./components/hydrate-new-vehicle-record-wrapper/hydrate-new-vehicle-record-wrapper.component'
							).then((m) => m.HydrateNewVehicleRecordWrapperComponent),
						data: {
							title: 'New technical record details',
							roles: Roles.TechRecordCreate,
							isCustomLayout: [FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS],
							isEditing: true,
							backlink: {
								url: RootRoutes.CREATE_TECHNICAL_RECORD,
								featureFlags: [FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS],
							},
						},
					},
					{
						path: TechRecordCreateRoutes.NEW_RECORD_DETAILS_CANCEL,
						loadComponent: () =>
							import('./components/new-record-details-cancel/new-record-details-cancel.component').then(
								(m) => m.NewRecordDetailsCancel
							),
						data: {
							roles: Roles.TechRecordCreate,
							isEditing: true,
							title: 'Cancel technical record reason',
							backlink: {
								url: TechRecordCreateRoutes.NEW_RECORD_DETAILS,
								featureFlags: [FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS],
							},
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
				data: {
					title: 'Duplicate VIN found',
					roles: Roles.TechRecordCreate,
					backlink: {
						url: RootRoutes.CREATE_TECHNICAL_RECORD,
						featureFlags: [FeatureFlags.TECH_RECORD_REDESIGN_CREATE],
					},
				},
			},
		],
	},
];
