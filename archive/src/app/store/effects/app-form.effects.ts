import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import {
  SetViewState,
  EVehicleTechRecordActions
} from '../actions/VehicleTechRecordModel.actions';
import { SetAppFormPristine } from '../actions/app-form-state.actions';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '../actions/Error.actions';

@Injectable()
export class AppFormEffects {
  @Effect()
  setAppFormPristine$: Observable<Action> = this.actions$.pipe(
    ofType<SetViewState>(EVehicleTechRecordActions.SetViewState),
    filter((action: SetViewState): boolean => action.viewState === VIEW_STATE.VIEW_ONLY),
    switchMap(() => {
      const actions = [];
      actions.push(new SetAppFormPristine());
      actions.push(new ClearErrorMessage());
      return actions;
    })
  );

  constructor(private actions$: Actions) {}
}
