import { ActivatedRouteSnapshot, CanActivate, CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { map, switchMap } from 'rxjs/operators';
import { getAppFormState } from '@app/store/selectors/app-form-state.selectors';
import { LoadModal } from './modal.actions';
import { APP_MODALS } from '@app/app.enums';
import { TechnicalRecordsContainer } from '@app/technical-record/technical-record.container';
import { TechnicalRecordComponent } from '@app/technical-record/technical-record.component';

@Injectable({ providedIn: 'root' })
export class ModalGuard implements CanDeactivate<TechnicalRecordsContainer> {
  constructor(private store: Store<IAppState>) {}

  isAppFormDirty(): Observable<boolean> {
    return this.store.pipe(
      select(getAppFormState),
      map((pristine) => {
        return pristine;
      })
    );
  }

  canDeactivate(
    component: TechnicalRecordsContainer,
    currentRoute: ActivatedRouteSnapshot,
    currentState: import('@angular/router').RouterStateSnapshot,
    nextState?: import('@angular/router').RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.isAppFormDirty().pipe(
      switchMap((pristine) => {
        if (!pristine) {
          this.store.dispatch(
            new LoadModal({
              currentModal: APP_MODALS.LOSE_CHANGES,
              currentRoute: getResolvedUrl(currentRoute)
            })
          );
        }
        return of(pristine);
      })
    );
  }

  // canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  //   return this.isAppFormDirty().pipe(
  //     switchMap((pristine) => {
  //       if (!pristine) {
  //         this.store.dispatch(
  //           new LoadModal({
  //             currentModal: APP_MODALS.LOSE_CHANGES,
  //             currentRoute: getResolvedUrl(route)
  //           })
  //         );
  //       }
  //       return of(pristine);
  //     })
  //   );
  // }
}

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map((v) => v.url.map((segment) => segment.toString()).join('/'))
    .join('/');
}
