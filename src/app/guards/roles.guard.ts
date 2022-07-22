import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { take, skipWhile, firstValueFrom } from 'rxjs';
import { UserService } from '@services/user-service/user-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    const storedRoles = await firstValueFrom(this.userService.roles$.pipe(skipWhile(msg => msg === null)).pipe(take(1)));
    const allowedRoles: string[] = next.data['roles'];

    return allowedRoles.some(x => storedRoles?.includes(x));
  }
}
