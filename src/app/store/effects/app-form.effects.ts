import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, switchMap, tap, map } from 'rxjs/operators';

import {
  SetViewState,
  EVehicleTechRecordActions
} from '../actions/VehicleTechRecordModel.actions';
import { SetAppFormPristine, SetAppFormDirty } from '../actions/app-form-state.actions';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '../actions/Error.actions';
import { SetTestViewState, EVehicleTestResultModelActions } from '../actions/VehicleTestResultModel.actions';

@Injectable()
export class AppFormEffects {
  @Effect()
  setTechFormPristine$: Observable<Action> = this.actions$.pipe(
    ofType<SetViewState>(EVehicleTechRecordActions.SetViewState),
    filter((action: SetViewState): boolean => action.viewState === VIEW_STATE.VIEW_ONLY),
    switchMap(() => {
      const actions = [];
      actions.push(new SetAppFormPristine());
      actions.push(new ClearErrorMessage());
      return actions;
    })
  );

  @Effect()
  setTechFormDirty$: Observable<Action> = this.actions$.pipe(
    ofType<SetViewState>(EVehicleTechRecordActions.SetViewState),
    filter((action: SetViewState): boolean => action.viewState !== VIEW_STATE.VIEW_ONLY),
    map(() => new SetAppFormDirty())
  );


  @Effect()
  setTestFormPristine$: Observable<Action> = this.actions$.pipe(
    ofType<SetTestViewState>(EVehicleTestResultModelActions.SetTestViewState),
    filter((action: SetTestViewState): boolean => action.editState === VIEW_STATE.VIEW_ONLY),
    switchMap(() => {
      const actions = [];
      actions.push(new SetAppFormPristine());
      actions.push(new ClearErrorMessage());
      return actions;
    })
  );

  @Effect()
  setTestFormDirty$: Observable<Action> = this.actions$.pipe(
    ofType<SetTestViewState>(EVehicleTestResultModelActions.SetTestViewState),
    filter((action: SetTestViewState): boolean => action.editState !== VIEW_STATE.VIEW_ONLY),
    map(() => new SetAppFormDirty())
  );

  constructor(private actions$: Actions) {}
}
