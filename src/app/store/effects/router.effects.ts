import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, filter, switchMap, withLatestFrom } from 'rxjs/operators';

import { IAppState } from '../state/app.state';
import { RouterStateUrl } from './../index';
import { ClearErrorMessage } from '../actions/Error.actions';
import { getErrors } from '../selectors/error.selectors';

@Injectable()
export class RouterEffects {
  @Effect()
  navigate$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    withLatestFrom(this.store.select(getErrors)),
    map(([action, errors]: [RouterNavigationAction<RouterStateUrl>, string[]]) => {
      const hasErrors = errors.length > 0;
      if (hasErrors) {
        return {
          params: { hasErrors }
        };
      }
      return { params: undefined };
    }),
    filter(({ params }) => !!params),
    switchMap(({ params }) => {
      const actions = [];
      const { hasErrors } = params;

      if (hasErrors) {
        actions.push(new ClearErrorMessage());
      }

      return actions;
    })
  );

  constructor(private store: Store<IAppState>, private actions$: Actions) {}
}
