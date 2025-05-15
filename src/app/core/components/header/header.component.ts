import { Component, input, output } from '@angular/core';
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

	logout() {
		this.logOutEvent.emit();
	}
}
