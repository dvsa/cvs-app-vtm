import { Component, EventEmitter, Input, Output } from '@angular/core';
import packageInfo from '../../../../../package.json';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	@Output() logOutEvent = new EventEmitter<void>();
	@Input() username: string | null = '';
	protected readonly version = packageInfo.version;

	logout() {
		this.logOutEvent.emit();
	}
}
