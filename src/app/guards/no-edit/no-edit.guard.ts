import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { routeEditable } from '@store/router/selectors/router.selectors';
import { Observable, map } from 'rxjs';

export const NoEditGuard = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.pipe(select(routeEditable), map((editable) => {
    if (!editable) return true;

    const tree = router.parseUrl(state.url);
    delete tree.queryParams['edit'];

    return tree;
  }));
};
