import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { map, switchMap, take } from 'rxjs/operators';
import { getAppFormState } from '@app/store/selectors/app-form-state.selectors';
import { LoadModal } from './modal.actions';
import { APP_MODALS, VIEW_STATE } from '@app/app.enums';
import { TechnicalRecordsContainer } from '@app/technical-record/technical-record.container';
import { TechnicalRecordComponent } from '@app/technical-record/technical-record.component';
import { getErrors } from '@app/store/selectors/error.selectors';
import { ClearErrorMessage } from '../store/actions/Error.actions';
import { SetViewState } from '@app/store/actions/VehicleTechRecordModel.actions';

@Injectable({ providedIn: 'root' })
export class ModalGuard implements CanActivate {
  constructor(private store: Store<IAppState>) {}

  isAppFormDirty(): Observable<boolean> {
    return this.store.pipe(
      select(getAppFormState),
      map((pristine) => {
        return pristine;
      })
    );
  }

  hasErrorsInStore(): Observable<boolean> {
    return this.store.pipe(
      select(getErrors),
      map((errors) => {
        return errors && errors.length > 0;
      }),
      take(1)
    );
  }
  // IF ROUTE IS change and error is populate then don't launch modal
  //  else lose chagnes
  // canDeactivate(
  //   component: TechnicalRecordsContainer,
  //   currentRoute: ActivatedRouteSnapshot,
  //   currentState: RouterStateSnapshot,
  //   nextState?: RouterStateSnapshot
  // ): boolean | Observable<boolean> | Promise<boolean> {
  //   return this.isAppFormDirty().pipe(
  //     switchMap((pristine) => {
  //       if (!pristine) {
  //         this.store.dispatch(
  //           new LoadModal({
  //             currentModal: APP_MODALS.LOSE_CHANGES,
  //             currentRoute: nextState.url
  //           })
  //         );
  //       }
  //       return of(pristine);
  //     })
  //   );
  // }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasErrorsInStore().pipe(
      switchMap((errors) => {
        if (errors) {
          this.store.dispatch(new SetViewState(VIEW_STATE.VIEW_ONLY));
          return of(errors);
        }
        return this.isAppFormDirty().pipe(
          switchMap((pristine) => {
            if (!pristine) {
              this.store.dispatch(
                new LoadModal({
                  currentModal: APP_MODALS.LOSE_CHANGES,
                  currentRoute: getResolvedUrl(route)
                })
              );
            }
            return of(pristine);
          })
        );
      })
    );
  }
}

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map((v) => v.url.map((segment) => segment.toString()).join('/'))
    .join('/');
}
