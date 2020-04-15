import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import {
  SetViewState,
  EVehicleTechRecordModelActions
} from './../actions/VehicleTechRecordModel.actions';
import { VIEW_STATE } from '@app/app.enums';
import { ClearErrorMessage } from '../actions/Error.actions';

@Injectable()
export class ErrorEffects {
  @Effect()
  clearSummaryErrors$ = this.actions$.pipe(
    ofType<SetViewState>(EVehicleTechRecordModelActions.SetViewState),
    filter((action: SetViewState): boolean => action.viewState === VIEW_STATE.VIEW_ONLY),
    map(() => new ClearErrorMessage())
  );

  constructor(private actions$: Actions) {}
}
