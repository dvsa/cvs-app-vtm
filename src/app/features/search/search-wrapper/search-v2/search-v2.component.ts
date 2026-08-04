import { RoleRequiredDirective } from '@/src/app/directives/app-role-required/app-role-required.directive';
import { Roles } from '@/src/app/models/roles.enum';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchFormComponent } from '../../search-form/search-form.component';

@Component({
	selector: 'app-search-v2',
	templateUrl: './search-v2.component.html',
	styleUrls: ['./search-v2.component.scss'],
	imports: [RoleRequiredDirective, SearchFormComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchV2Component {
	roles = Roles;
}
