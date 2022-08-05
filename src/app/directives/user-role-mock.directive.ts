import { Directive, Input } from '@angular/core';

@Directive({ selector: '[appRoleRequired]' })
export class UserRoleDirective {
  constructor() {}

  userRoles: string[] | undefined;

  @Input()
  set appRoleRequired(roles: string[]) {
    this.userRoles = roles;
  }
}
