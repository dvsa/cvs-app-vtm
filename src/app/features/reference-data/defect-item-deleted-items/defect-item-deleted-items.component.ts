import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { Component } from '@angular/core';

@Component({
	selector: 'app-defect-item-deleted-items',
	templateUrl: './defect-item-deleted-items.component.html',
	styleUrls: ['./defect-item-deleted-items.component.scss'],
	imports: [RoleRequiredDirective],
})
export class DefectItemDeletedItemsComponent {
	roles = Roles;
}
