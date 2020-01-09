import {Injectable} from '@angular/core';
import {Actions, Effect, EffectNotification, ofType, OnRunEffects} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {tap, exhaustMap} from 'rxjs/operators';
import {LoadAction, SetSubmittedValueAction} from '@app/adr-details-form/store/adrDetails.actions';


@Injectable()
export class AdrDetailsFormEffects implements OnRunEffects {
  @Effect({ dispatch: false })
  submit$ = this.actions$.pipe(
    ofType<SetSubmittedValueAction>(SetSubmittedValueAction.TYPE),
    tap(action => {
      console.log('In AdrDetailsFormEffects submittedValue =>', action.submittedValue);
    })
  );

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      exhaustMap((res) => {
        return resolvedEffects$;
      })
    );
  }

  constructor(
    private actions$: Actions,
  ) { }
}
