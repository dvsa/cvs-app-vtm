import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoQueryParamsGuard } from '@guards/no-query-params/no-query-params.guard';
import { SearchRoutes } from '@models/routes.enum';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'prefix',
		loadComponent: () => import('./search.component').then((m) => m.SearchComponent),
	},
	{
		path: SearchRoutes.SEARCH_RESULT,
		loadComponent: () =>
			import('./multiple-search-results/multiple-search-results.component').then(
				(m) => m.MultipleSearchResultsComponent
			),
		canActivate: [NoQueryParamsGuard],
		data: { title: 'Search Results' },
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SearchRoutingModule {}
