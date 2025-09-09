import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { CancelEditTechGuard } from '@guards/cancel-edit-tech/cancel-edit-tech.guard';
import { FeatureToggleGuard } from '@guards/feature-toggle-guard/feature-toggle.guard';
import { RoleGuard } from '@guards/role-guard/roles.guard';
import { Roles } from '@models/roles.enum';
import { RootRoutes } from '@models/routes.enum';
import { techRecordViewResolver } from './resolvers/tech-record-view/tech-record-view.resolver';
import { titleResolver } from './resolvers/title/title.resolver';

const routes: Routes = [
	{
		path: RootRoutes.ROOT,
		resolve: { title: titleResolver },
		children: [
			{
				path: RootRoutes.ROOT,
				data: { title: 'Home', roles: Roles.TechRecordView },
				canActivate: [MsalGuard, RoleGuard],
				canDeactivate: [CancelEditTechGuard],
				loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
			},
			{
				path: RootRoutes.SEARCH_TECHNICAL_RECORD,
				data: { title: 'Technical record search', roles: Roles.TechRecordView },
				canActivate: [MsalGuard, RoleGuard],
				canDeactivate: [CancelEditTechGuard],
				loadChildren: () => import('./features/search/search.routes').then((m) => m.routes),
			},
			{
				path: RootRoutes.CREATE_TECHNICAL_RECORD,
				data: {
					title: 'Create new technical record',
					roles: Roles.TechRecordCreate,
				},
				canActivate: [MsalGuard, RoleGuard],
				loadChildren: () => import('./features/tech-record/create/create-tech-records.routes').then((m) => m.routes),
			},
			{
				path: RootRoutes.BATCH_CREATE_TECHNICAL_RECORD,
				data: { title: 'Select Vehicle Type', roles: Roles.TechRecordCreate },
				canActivate: [MsalGuard, RoleGuard],
				loadChildren: () =>
					import('./features/tech-record/create-batch/create-batch.module').then((m) => m.CreateBatchModule),
			},
			{
				path: RootRoutes.CURRENT_TEST_RESULT,
				data: { title: 'Test Result', roles: Roles.TestResultView },
				canActivate: [MsalGuard, RoleGuard],
				resolve: { techRecord: techRecordViewResolver },
				loadChildren: () =>
					import('./features/test-records/amend/amend-test-records.module').then((m) => m.AmendTestRecordsModule),
			},
			{
				path: RootRoutes.CURRENT_TECH_RECORD,
				data: { title: 'Tech Record', roles: Roles.TechRecordView },
				canActivate: [MsalGuard, RoleGuard],
				loadChildren: () => import('./features/tech-record/tech-record.module').then((m) => m.TechRecordsModule),
			},
			{
				path: RootRoutes.REFERENCE_DATA,
				data: {
					title: 'Select Reference Data Type',
					roles: Roles.ReferenceDataView,
				},
				canActivate: [MsalGuard, RoleGuard],
				loadChildren: () =>
					import('./features/reference-data/reference-data.module').then((m) => m.ReferenceDataModule),
			},
			{
				path: RootRoutes.FEATURE_TOGGLE,
				data: { title: 'Feature Toggle', featureToggleName: 'testtoggle' },
				canActivate: [MsalGuard, FeatureToggleGuard],
				loadChildren: () =>
					import('./features/feature-toggle/feature-toggle.module').then((m) => m.FeatureToggleModule),
			},
			{
				path: RootRoutes.BETAS,
				data: { title: 'Betas', featureToggleName: 'betas' },
				canActivate: [MsalGuard, FeatureToggleGuard],
				loadComponent: () => import('./features/betas/betas.component').then((m) => m.BetasComponent),
			},
			{
				path: RootRoutes.ERROR,
				pathMatch: 'full',
				loadComponent: () =>
					import('@core/components/server-error/server-error.component').then((m) => m.ServerErrorComponent),
			},
		],
	},
	{
		path: RootRoutes.WILDCARD,
		pathMatch: 'full',
		loadComponent: () =>
			import('@core/components/page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent),
	},
];
@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
