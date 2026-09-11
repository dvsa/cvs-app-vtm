import { cancelBatchGuard } from '@/src/app/guards/cancel-batch/cancel-batch.guard';
import { FeatureToggleGuard } from '@/src/app/guards/feature-toggle-guard/feature-toggle.guard';
import { RoleGuard } from '@/src/app/guards/role-guard/roles.guard';
import { Roles } from '@/src/app/models/roles.enum';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { techRecordDataResolver } from '@/src/app/resolvers/tech-record-data/tech-record-data.resolver';
import { AxlesService } from '@/src/app/services/axles/axles.service';
import { FeatureFlags } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
	{
		path: '',
		data: { roles: Roles.TechRecordCreate, featureToggleName: FeatureFlags.BATCH_REDESIGN },
		canActivate: [MsalGuard, RoleGuard, FeatureToggleGuard],
		canDeactivate: [cancelBatchGuard],
		resolve: { data: techRecordDataResolver },
		providers: [AxlesService],
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: BatchRoutes.ENTER_BATCH_DETAILS,
			},
			{
				path: BatchRoutes.CANCEL_BATCH,
				data: {
					title: 'Cancel batch - Vehicle Testing Management',
					roles: Roles.TechRecordCreate,
					featureToggleName: FeatureFlags.BATCH_REDESIGN,
					backlink: { url: RootRoutes.ROOT },
				},
				canActivate: [MsalGuard, RoleGuard, FeatureToggleGuard],
				loadComponent: () => import('./cancel-batch/cancel-batch.component').then((m) => m.CancelBatchComponent),
			},
			{
				path: BatchRoutes.ENTER_BATCH_DETAILS,
				data: {
					title: 'Enter details for this batch - Vehicle Testing Management',
					roles: Roles.TechRecordCreate,
					featureToggleName: FeatureFlags.BATCH_REDESIGN,
					backlink: { url: RootRoutes.ROOT },
				},
				canActivate: [MsalGuard, RoleGuard, FeatureToggleGuard],
				loadComponent: () =>
					import('./enter-batch-details/enter-batch-details.component').then((m) => m.EnterBatchDetailsComponent),
			},
			{
				path: BatchRoutes.ENTER_BATCH_SIZE,
				data: {
					title: 'Enter number of vehicles in this batch - Vehicle Testing Management',
					roles: Roles.TechRecordCreate,
					featureToggleName: FeatureFlags.BATCH_REDESIGN,
					backlink: { url: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_BATCH_DETAILS}` },
				},
				canActivate: [MsalGuard, RoleGuard, FeatureToggleGuard],
				loadComponent: () =>
					import('./enter-batch-size/enter-batch-size.component').then((m) => m.EnterBatchSizeComponent),
			},
			{
				path: BatchRoutes.ENTER_BATCH_IDENTIFIERS,
				data: {
					title: 'Enter details for each vehicle - Vehicle Testing Management',
					roles: Roles.TechRecordCreate,
					featureToggleName: FeatureFlags.BATCH_REDESIGN,
					backlink: { url: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_BATCH_SIZE}` },
				},
				canActivate: [MsalGuard, RoleGuard, FeatureToggleGuard],
				loadComponent: () =>
					import('./enter-batch-identifiers/enter-batch-identifiers.component').then((m) => m.EnterBatchIdentifiers),
			},
			{
				path: BatchRoutes.ENTER_TECH_RECORD_DETAILS,
				data: {
					roles: Roles.TechRecordCreate,
					featureToggleName: FeatureFlags.BATCH_REDESIGN,
					isEditing: true,
				},
				canActivate: [MsalGuard, RoleGuard, FeatureToggleGuard],
				children: [
					{
						path: '',
						data: {
							title: 'Enter details for this batch - Vehicle Testing Management',
							roles: Roles.TechRecordCreate,
							featureToggleName: FeatureFlags.BATCH_REDESIGN,
							backlink: { url: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_BATCH_IDENTIFIERS}` },
							isEditing: true,
						},
						loadComponent: () =>
							import('./enter-tech-record-details/enter-tech-record-details.component').then(
								(m) => m.EnterTechRecordDetailsComponent
							),
					},
					{
						path: BatchRoutes.TYRE_SEARCH,
						data: {
							title: 'Tyre search',
							roles: Roles.TechRecordCreate,
							isEditing: true,
							featureToggleName: FeatureFlags.BATCH_REDESIGN,
							backlink: { url: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_TECH_RECORD_DETAILS}` },
						},
						canActivate: [MsalGuard, RoleGuard],
						loadComponent: () =>
							import('../components/tech-record-search-tyres/tech-record-search-tyres.component').then(
								(m) => m.TechRecordSearchTyresComponent
							),
					},
				],
			},
			{
				path: BatchRoutes.BATCH_SUMMARY,
				data: {
					title: 'Batch summary',
					roles: Roles.TechRecordCreate,
					featureToggleName: FeatureFlags.BATCH_REDESIGN,
					backlink: { url: RootRoutes.ROOT, label: 'Go back to home page' },
				},
				canActivate: [MsalGuard, RoleGuard],
				loadComponent: () => import('./batch-summary/batch-summary.component').then((m) => m.BatchSummaryComponent),
			},
		],
	},
];
