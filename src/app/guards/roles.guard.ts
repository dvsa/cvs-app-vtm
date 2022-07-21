import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { take } from 'rxjs';
import { UserService } from '@services/user-service/user-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    let matchingRoles = false;
    this.userService.roles$.pipe(take(1)).subscribe(storedRoles => {
      const allowedRoles: string[] = next.data['roles'];
      matchingRoles = allowedRoles.some(x => storedRoles.includes(x));
    });

    return matchingRoles;
  }
}
