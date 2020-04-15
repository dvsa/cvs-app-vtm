import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import {
  SetViewState,
  EVehicleTechRecordActions
} from './../actions/VehicleTechRecordModel.actions';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '../actions/Error.actions';

@Injectable()
export class ErrorEffects {
  @Effect()
  clearSummaryErrors$: Observable<Action> = this.actions$.pipe(
    ofType<SetViewState>(EVehicleTechRecordActions.SetViewState),
    filter((action: SetViewState): boolean => action.viewState === VIEW_STATE.VIEW_ONLY),
    map(() => new ClearErrorMessage())
  );

  constructor(private actions$: Actions) {}
}
