import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { InteractionStatus } from '@azure/msal-browser';
import { UserService } from '@services/user-service/user-service';
import {
  Observable, filter, map, switchMap,
} from 'rxjs';

export const RoleGuard = (next: ActivatedRouteSnapshot): Observable<boolean> => {
  const userService = inject(UserService);

  return userService.inProgress$.pipe(
    filter((status: InteractionStatus) => InteractionStatus.None === status),
    switchMap(() => userService.roles$),
    map((roles) => {
      return roles?.some((x) => next.data['roles'].includes(x)) || false;
    }),
  );
};
