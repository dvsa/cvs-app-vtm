import { ButtonComponent } from '@/src/app/components/button/button.component';
import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { Component } from '@angular/core';

@Component({
	selector: 'app-search-v2',
	templateUrl: './search-v2.component.html',
	styleUrls: ['./search-v2.component.scss'],
	imports: [ButtonComponent, RoleRequiredDirective],
})
export class SearchV2Component {
	roles = Roles;
}
