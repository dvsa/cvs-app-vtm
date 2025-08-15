import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, inject, input, output } from '@angular/core';
import packageInfo from '../../../../../package.json';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	readonly logOutEvent = output<void>();
	readonly username = input<string | null>('');
	protected readonly version = packageInfo.version;

	featureToggleService = inject(FeatureToggleService);

	logout() {
		this.logOutEvent.emit();
	}
}
