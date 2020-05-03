import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, withLatestFrom, filter } from 'rxjs/operators';

import { IAppState } from '../state/app.state';
import { RouterStateUrl } from './../index';
import { SetViewState } from './../actions/VehicleTechRecordModel.actions';
import { getViewState } from './../selectors/VehicleTechRecordModel.selectors';
import { VIEW_STATE } from '@app/app.enums';

@Injectable()
export class RouterEffects {
  @Effect()
  navigate$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    withLatestFrom(this.store.select(getViewState)),
    // filter(
    //   ([action, currentState]: [RouterNavigationAction<RouterStateUrl>, VIEW_STATE]) =>
    //     currentState === VIEW_STATE.EDIT
    // ),
    map(([action, currentState]) => new SetViewState(VIEW_STATE.VIEW_ONLY))
  );

  constructor(private store: Store<IAppState>, private actions$: Actions) {}
}
