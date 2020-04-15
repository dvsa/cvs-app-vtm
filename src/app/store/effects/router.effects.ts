import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, filter, switchMap, withLatestFrom } from 'rxjs/operators';

import { IAppState } from '../state/app.state';
import { RouterStateUrl } from './../index';
import { SetViewState } from './../actions/VehicleTechRecordModel.actions';
import { ClearErrorMessage } from '../actions/Error.actions';
import { getTechViewState } from './../selectors/VehicleTechRecordModel.selectors';
import { getErrors } from '../selectors/error.selectors';
import { VIEW_STATE } from '@app/app.enums';

@Injectable()
export class RouterEffects {
  @Effect()
  navigate$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    withLatestFrom(this.store.select(getTechViewState), this.store.select(getErrors)),
    map(
      ([action, currentState, errors]: [
        RouterNavigationAction<RouterStateUrl>,
        VIEW_STATE,
        string[]
      ]) => {
        const isEditState = currentState === VIEW_STATE.EDIT;
        const hasErrors = errors.length > 0;

        if (isEditState || hasErrors) {
          return {
            params: { isEditState, hasErrors }
          };
        }
        return { params: undefined };
      }
    ),
    filter(({ params }) => !!params),
    switchMap(({ params }) => {
      const actions = [];
      const { isEditState, hasErrors } = params;
      if (isEditState) {
        actions.push(new SetViewState(VIEW_STATE.VIEW_ONLY));
      }

      if (hasErrors) {
        actions.push(new ClearErrorMessage());
      }

      return actions;
    })
  );

  constructor(private store: Store<IAppState>, private actions$: Actions) {}
}
