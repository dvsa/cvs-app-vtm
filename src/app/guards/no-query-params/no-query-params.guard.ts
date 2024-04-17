import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { Observable, map } from 'rxjs';

export const NoQueryParamsGuard = (): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.pipe(
    select(selectQueryParams),
    map((queryParams) => Object.keys(queryParams).length > 0
      ? true
      : router.getCurrentNavigation()?.previousNavigation?.finalUrl ?? router.parseUrl('')),
  );
};
