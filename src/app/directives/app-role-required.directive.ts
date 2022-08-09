import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@services/user-service/user-service';
import { take } from 'rxjs';
import { Roles } from '@models/roles.enum';

@Directive({ selector: '[appRoleRequired]' })
export class RoleRequiredDirective implements OnInit {
  constructor(private templateRef: TemplateRef<any>, private userService: UserService, private viewContainer: ViewContainerRef) {}

  userRolesRequired: string[] | undefined;

  @Input()
  set appRoleRequired(role: Roles) {
    this.userRolesRequired = role && role.split(',');
  }

  ngOnInit() {
    this.userService.roles$.pipe(take(1)).subscribe(storedRoles => {
      let hasAccess = false;
      if (this.userRolesRequired) {
        hasAccess = this.userRolesRequired.some(r => storedRoles?.includes(r));
      }

      if (hasAccess) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
