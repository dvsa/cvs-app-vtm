import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from '@store/.';
import {
  routeEditable,
  selectQueryParam,
  selectQueryParams,
  selectRouteParam,
  selectRouteParams,
  selectRouteNestedParams
} from '@store/router/selectors/router.selectors';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  constructor(private store: Store<State>) {}

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

  get routeEditable$() {
    return this.store.pipe(select(routeEditable));
  }
}
