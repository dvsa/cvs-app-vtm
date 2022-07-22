import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@services/user-service/user-service';
import { take } from 'rxjs';

@Directive({ selector: '[appUserRole]' })
export class UserRoleDirective implements OnInit {
  constructor(private templateRef: TemplateRef<any>, private userService: UserService, private viewContainer: ViewContainerRef) {}

  userRoles: string[] | undefined;

  @Input()
  set appUserRole(roles: string[]) {
    if (!roles || !roles.length) {
      throw new Error('Roles value is empty or missing');
    }
    this.userRoles = roles;
  }

  ngOnInit() {
    this.userService.roles$.pipe(take(1)).subscribe(storedRoles => {
      let hasAccess = false;

      if (this.userRoles) {
        hasAccess = this.userRoles.some(r => storedRoles.includes(r));
      }

      if (hasAccess) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
