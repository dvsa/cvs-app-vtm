import { Injectable } from '@angular/core';
import { filter, map, switchMap } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';

import {
  SetViewState,
  EVehicleTechRecordModelActions
} from '../actions/VehicleTechRecordModel.actions';
import { SetAppFormPristine } from '../actions/app-form-state.actions';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '../actions/Error.actions';
import { Action } from '@ngrx/store';

@Injectable()
export class AppFormEffects {
  @Effect()
  setAppFormPristine$ = this.actions$.pipe(
    ofType<SetViewState>(EVehicleTechRecordModelActions.SetViewState),
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
