import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { InteractionStatus } from '@azure/msal-browser';
import { UserService } from '@services/user-service/user-service';
import { Observable, filter, map, switchMap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RoleGuard implements CanActivate {
	userService = inject(UserService);

	canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
		return this.userService.inProgress$.pipe(
			filter((status: InteractionStatus) => InteractionStatus.None === status),
			switchMap(() => this.userService.roles$),
			map((roles) => {
				return roles?.some((x) => next.data['roles']?.includes(x)) || false;
			})
		);
	}
}
