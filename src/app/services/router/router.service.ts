import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import {
	routeEditable,
	routerState,
	selectQueryParam,
	selectQueryParams,
	selectRouteData,
	selectRouteDataProperty,
	selectRouteNestedParams,
	selectRouteParam,
} from '@store/router/router.selectors';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RouterService {
	store = inject(Store);
	router = inject(Router);
	activatedRoute = inject(ActivatedRoute);

	router$ = this.store.pipe(select(routerState));
	queryParams$ = this.store.pipe(select(selectQueryParams));
	routeNestedParams$ = this.store.pipe(select(selectRouteNestedParams));
	routeEditable$ = this.store.pipe(select(routeEditable));
	routeData$ = this.store.pipe(select(selectRouteData));

	getQueryParam$(param: string) {
		return this.store.pipe(select(selectQueryParam(param)));
	}

	getRouteParam$(param: string) {
		return this.store.pipe(select(selectRouteParam(param)));
	}

	getRouteNestedParam$(param: string): Observable<string | undefined> {
		return this.routeNestedParams$.pipe(map((route) => route[`${param}`]));
	}

	getRouteDataProperty$(property: string) {
		return this.store.pipe(select(selectRouteDataProperty(property)));
	}

	async addQueryParams(queryParams: Params) {
		const url = this.router
			.createUrlTree([], { relativeTo: this.activatedRoute, queryParams, queryParamsHandling: 'merge' })
			.toString();
		await this.router.navigateByUrl(url);
	}
}
