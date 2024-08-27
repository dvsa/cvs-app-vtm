import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	@Output() logOutEvent = new EventEmitter<void>();
	@Input() username: string | null = '';

	logout() {
		this.logOutEvent.emit();
	}
}
