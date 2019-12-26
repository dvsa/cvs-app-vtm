import {Injectable} from '@angular/core';
import {Actions, Effect, EffectNotification, ofType, OnRunEffects} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {tap, exhaustMap} from 'rxjs/operators';
import {LoadAction} from '@app/adr-details-form/store/adrDetails.actions';


@Injectable()
export class AdrDetailsFormEffects implements OnRunEffects {
  @Effect({ dispatch: false })
  load$ = this.actions$.pipe(
    ofType<LoadAction>(LoadAction.TYPE),
    tap(action => {
      console.log('In AdrDetailsFormEffects payload =>', action.payload);
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
