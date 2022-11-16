import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@services/user-service/user-service';
import { take } from 'rxjs';
import { Roles } from '@models/roles.enum';

@Directive({ selector: '[appRoleRequired]' })
export class RoleRequiredDirective implements OnInit {
  constructor(private templateRef: TemplateRef<any>, private userService: UserService, private viewContainer: ViewContainerRef) {}

  userRolesRequired: string[] | undefined;

  @Input()
  set appRoleRequired(roles: Roles) {
    this.userRolesRequired = roles?.split(',');
  }

  ngOnInit() {
    this.userService.roles$.pipe(take(1)).subscribe(storedRoles => {
      const hasAccess = this.userRolesRequired?.some(role => storedRoles?.includes(role));

      if (hasAccess) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
