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

	get router$() {
		return this.store.pipe(select(routerState));
	}

	get queryParams$(): Observable<Params> {
		return this.store.pipe(select(selectQueryParams));
	}

	getQueryParam$(param: string) {
		return this.store.pipe(select(selectQueryParam(param)));
	}

	getRouteParam$(param: string) {
		return this.store.pipe(select(selectRouteParam(param)));
	}

	get routeNestedParams$() {
		return this.store.pipe(select(selectRouteNestedParams));
	}

	getRouteNestedParam$(param: string): Observable<string | undefined> {
		return this.routeNestedParams$.pipe(map((route) => route[`${param}`]));
	}

	get routeEditable$() {
		return this.store.pipe(select(routeEditable));
	}

	get routeData$() {
		return this.store.pipe(select(selectRouteData));
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
