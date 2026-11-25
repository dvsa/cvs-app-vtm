import { Component, inject } from '@angular/core';
import { RoleRequiredDirective } from '@directives/app-role-required/app-role-required.directive';
import { FeatureToggleDirective } from '@directives/feature-toggle/feature-toggle.directive';
import { Roles } from '@models/roles.enum';
import { FeatureFlags, FeatureToggleService } from '../../services/feature-toggle-service/feature-toggle-service';
import { HomeButtonComponent } from './components/home-button/home-button.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	imports: [RoleRequiredDirective, HomeButtonComponent, FeatureToggleDirective],
})
export class HomeComponent {
	featureToggleService = inject(FeatureToggleService);
	Roles = Roles;
	FeatureFlags = FeatureFlags;
}
