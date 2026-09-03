import { FeatureToggleGuard } from '@/src/app/guards/feature-toggle-guard/feature-toggle.guard';
import { RoleGuard } from '@/src/app/guards/role-guard/roles.guard';
import { Roles } from '@/src/app/models/roles.enum';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { techRecordDataResolver } from '@/src/app/resolvers/tech-record-data/tech-record-data.resolver';
import { FeatureFlags } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
	{
		path: '',
		data: { roles: Roles.TechRecordCreate, featureToggleName: FeatureFlags.BATCH_REDESIGN },
		canActivate: [MsalGuard, RoleGuard, FeatureToggleGuard],
		resolve: { data: techRecordDataResolver },
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
		],
	},
];
