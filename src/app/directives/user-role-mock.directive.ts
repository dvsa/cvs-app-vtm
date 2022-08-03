import { Directive, Input } from '@angular/core';

@Directive({ selector: '[appUserRole]' })
export class UserRoleDirective {
  constructor() {}

  userRoles: string[] | undefined;

  @Input()
  set appUserRole(roles: string[]) {
    if (!roles || !roles.length) {
      throw new Error('Roles value is empty or missed');
    }
    this.userRoles = roles;
  }
}
