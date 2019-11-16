import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as RouterActions from '../actions/router';
import 'rxjs-compat/add/operator/do';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  navigate$ = this.actions$.ofType(RouterActions.GO).pipe(
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) =>
      this.router.navigate(path, { queryParams, ...extras })
    )
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$
    .ofType(RouterActions.BACK)
    .do(() => this.location.back());

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$
    .ofType(RouterActions.FORWARD)
    .do(() => this.location.forward());

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}
}
