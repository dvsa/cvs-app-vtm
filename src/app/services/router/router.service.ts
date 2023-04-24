import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import {
  routeEditable,
  routerState,
  selectQueryParam,
  selectQueryParams,
  selectRouteData,
  selectRouteDataProperty,
  selectRouteNestedParams,
  selectRouteParam
} from '@store/router/selectors/router.selectors';
import { Observable, map } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  constructor(private store: Store<State>, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {}

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
    return this.store.pipe(
      select(selectRouteNestedParams),
      map(route => route[param])
    );
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

  addQueryParams(queryParams: Params) {
    const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams, queryParamsHandling: 'merge' }).toString();
    this.router.navigateByUrl(url);
  }
}
