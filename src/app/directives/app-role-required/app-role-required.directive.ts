import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Roles } from '@models/roles.enum';
import { UserService } from '@services/user-service/user-service';
import { take } from 'rxjs';

@Directive({ selector: '[appRoleRequired]' })
export class RoleRequiredDirective implements OnInit {
	templateRef = inject<TemplateRef<HTMLElement>>(TemplateRef);
	userService = inject(UserService);
	viewContainer = inject(ViewContainerRef);

	userRolesRequired: string[] | undefined;

	@Input()
	set appRoleRequired(roles: Roles | Roles[]) {
		this.userRolesRequired = Array.isArray(roles)
			? [...new Set(roles.flatMap((role) => role.split(',')))]
			: roles?.split(',');
	}

	ngOnInit() {
		this.userService.roles$.pipe(take(1)).subscribe((storedRoles) => {
			const hasAccess = this.userRolesRequired?.some((role) => storedRoles?.includes(role));

			if (hasAccess) {
				this.viewContainer.createEmbeddedView(this.templateRef);
			} else {
				this.viewContainer.clear();
			}
		});
	}
}
