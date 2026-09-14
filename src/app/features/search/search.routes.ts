import { Routes } from '@angular/router';
import { NoQueryParamsGuard } from '@guards/no-query-params/no-query-params.guard';
import { RootRoutes, SearchRoutes } from '@models/routes.enum';
import { FeatureFlags } from '../../services/feature-toggle-service/feature-toggle-service';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'prefix',
		loadComponent: () => import('./search/search.component').then((m) => m.SearchComponent),
		data: {
			backlink: {
				url: RootRoutes.ROOT,
				featureFlags: [FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS],
			},
		},
	},
	{
		path: SearchRoutes.SEARCH_RESULT,
		loadComponent: () => import('./search-results/search-results.component').then((m) => m.SearchResultsComponent),
		canActivate: [NoQueryParamsGuard],
		data: {
			title: 'Search results for technical records',
			backlink: {
				url: RootRoutes.SEARCH_TECHNICAL_RECORD,
				featureFlags: [FeatureFlags.TECH_RECORD_REDESIGN_CREATE_DETAILS],
			},
		},
	},
];
