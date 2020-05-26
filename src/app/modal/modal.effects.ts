import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { VIEW_STATE } from '@app/app.enums';
import { ResetModal, RedirectModal, EModalStateActions } from './modal.actions';
import {
  SetViewState
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { SetAppFormPristine } from '@app/store/actions/app-form-state.actions';

@Injectable()
export class ModalEffects {
  @Effect()
  resetModal$: Observable<Action> = this.actions$.pipe(
    ofType<ResetModal>(EModalStateActions.ResetModal),
    map((action) => action.urlToRedirect),
    switchMap((urlToRedirect?: string) => {
      const actions = [];
      if (urlToRedirect) {
        actions.push(new RedirectModal(urlToRedirect));
        actions.push(new SetAppFormPristine());
        actions.push(new SetViewState(VIEW_STATE.VIEW_ONLY));
      }
      return actions;
    })
  );

  @Effect({ dispatch: false })
  redirectModal$: Observable<Action> = this.actions$.pipe(
    ofType<RedirectModal>(EModalStateActions.RedirectModal),
    map((action) => action.urlToRedirect),
    switchMap((urlToRedirect?: string) => {
      if (urlToRedirect) {
          this.router.navigateByUrl(urlToRedirect);
      }
      return of(undefined);
    })
  );

  constructor(private actions$: Actions, private router: Router) {}
}
