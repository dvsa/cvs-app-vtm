import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { EModalStateActions, ChangeView } from './modal.actions';
import { ModalState } from './modal.reducer';
import { APP_MODALS } from '../app.enums';

@Injectable()
export class ModalEffects {
  @Effect({ dispatch: false })
  changeView$: Observable<Action> = this.actions$.pipe(
    ofType<ChangeView>(EModalStateActions.ChangeView),
    map((action) => action.payload.currentRoute),
    switchMap((modalState: ModalState) => {
      if (modalState.currentRoute) {
        this.router.navigateByUrl(modalState.currentRoute);
      }
      return of(undefined);
    })
  );

  constructor(private actions$: Actions, private router: Router) {}
}
