import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { Component } from '@angular/core';

@Component({
	selector: 'app-defect-category-deleted-items',
	templateUrl: './defect-category-deleted-items.component.html',
	styleUrls: ['./defect-category-deleted-items.component.scss'],
	imports: [RoleRequiredDirective],
})
export class DefectCategoryDeletedItemsComponent {
	roles = Roles;
}
