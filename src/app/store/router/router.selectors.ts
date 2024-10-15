import { Params } from '@angular/router';
import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const STORE_FEATURE_ROUTER_STORE_KEY = 'router';
export const selectRouter = createFeatureSelector<RouterReducerState>(STORE_FEATURE_ROUTER_STORE_KEY);

const selectMergedRoute = createSelector(selectRouter, (routerReducerState) => routerReducerState?.state);

export const selectMergedRouteUrl = createSelector(selectMergedRoute, (mergedRoute) => mergedRoute?.url?.substring(1));

export const {
	selectCurrentRoute, // select the current route
	selectFragment, // select the current route fragment
	selectQueryParams, // select the current route query params
	selectQueryParam, // factory function to select a query param
	selectRouteParams, // select the current route params
	selectRouteParam, // factory function to select a route param
	selectRouteData, // select the current route data
	selectUrl, // select the current url
} = getRouterSelectors();

export const routerState = createSelector(selectRouter, (state) => state);
export const currentRouteState = createSelector(selectCurrentRoute, (state) => state);

export const selectRouteDataProperty = (property: string) =>
	createSelector(selectRouteData, (data) => data?.[`${property}`]);

export const selectRouteNestedParams = createSelector(selectRouter, (router) => {
	let currentRoute = router?.state?.root;
	let params: Params = {};
	while (currentRoute?.firstChild) {
		currentRoute = currentRoute.firstChild;
		params = {
			...params,
			...currentRoute.params,
		};
	}
	return params;
});

export const routeEditable = createSelector(selectQueryParam('edit'), (edit) => edit === 'true');
