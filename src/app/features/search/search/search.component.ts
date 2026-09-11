import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchFormComponent } from '../search-form/search-form.component';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	imports: [RoleRequiredDirective, SearchFormComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
	roles = Roles;
}
