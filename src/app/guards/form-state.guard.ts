import {
  ActivatedRouteSnapshot,
  CanActivate,
  Params,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { map, switchMap } from 'rxjs/operators';
import { getAppFormState } from '@app/store/selectors/app-form-state.selectors';
import { LoadModal } from '../modal/modal.actions';
import { APP_MODALS } from '@app/app.enums';

@Injectable({ providedIn: 'root' })
export class FormStateGuard implements CanActivate {
  constructor(private store: Store<IAppState>) {}

  isAppFormDirty(): Observable<boolean> {
    return this.store.select(getAppFormState);
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.isAppFormDirty().pipe(
      switchMap((pristine) => {
        if (!pristine) {
          this.store.dispatch(
            new LoadModal({
              currentModal: APP_MODALS.LOSE_CHANGES,
              urlToRedirect: `${getResolvedUrl(route)}${getQueryString(route.queryParams)}`
            })
          );
        }
        return of(pristine);
      })
    );
  }
}

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map((v) => v.url.map((segment) => segment.toString()).join('/'))
    .join('/');
}

function getQueryString(queryParams: Params): string {
  return Object.keys(queryParams).reduce(function(str, key, i) {
    let delimiter, val;
    delimiter = i === 0 ? '?' : '&';
    val = queryParams[key];
    return [str, delimiter, key, '=', val].join('');
  }, '');
}
