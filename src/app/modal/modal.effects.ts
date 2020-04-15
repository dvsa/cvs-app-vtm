import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { ChangeView, EModalStateActions, ResetModal } from './modal.actions';
import { ModalState } from './modal.reducer';
import { SetAppFormPristine } from '../store/actions/app-form-state.actions';
import { IAppState } from '@app/store/state/app.state';
import { getCurrentModalState } from './modal.selectors';
import { ResetAction } from 'ngrx-forms';

@Injectable()
export class ModalEffects {
  @Effect()
  resetModal$: Observable<Action> = this.actions$.pipe(
    ofType<ResetModal>(EModalStateActions.ResetModal),
    withLatestFrom(this.store.select(getCurrentModalState)),
    map(([action, currState]: [ResetAction, ModalState]) => currState),
    switchMap((modalState: ModalState) => {
      const actions = [];

      actions.push(new SetAppFormPristine());
      if (modalState.urlToRedirect) {
        actions.push(new ChangeView(modalState.urlToRedirect));
      }
      return actions;
    })
  );

  @Effect({ dispatch: false })
  changeView$: Observable<Action> = this.actions$.pipe(
    ofType<ChangeView>(EModalStateActions.ChangeView),
    map((action) => action.urlToRedirect),
    switchMap((urlToRedirect: string) => {
      this.router.navigateByUrl(urlToRedirect);
      return of(undefined);
    })
  );

  constructor(
    private store: Store<IAppState>,
    private actions$: Actions,
    private router: Router
  ) {}
}
