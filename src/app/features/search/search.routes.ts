import { Routes } from '@angular/router';
import { NoQueryParamsGuard } from '@guards/no-query-params/no-query-params.guard';
import { RootRoutes, SearchRoutes } from '@models/routes.enum';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'prefix',
		loadComponent: () => import('./search-wrapper/search-wrapper.component').then((m) => m.SearchWrapperComponent),
		data: {
			backlink: {
				url: RootRoutes.ROOT,
				featureFlags: ['techrecordredesigncreatedetails'],
			},
		},
	},
	{
		path: SearchRoutes.SEARCH_RESULT,
		loadComponent: () =>
			import('./search-results-wrapper/search-results-wrapper.component').then((m) => m.SearchResultsWrapperComponent),
		canActivate: [NoQueryParamsGuard],
		data: {
			title: 'Search results for technical records',
			backlink: {
				url: RootRoutes.SEARCH_TECHNICAL_RECORD,
				featureFlags: ['techrecordredesigncreatedetails'],
			},
		},
	},
];
