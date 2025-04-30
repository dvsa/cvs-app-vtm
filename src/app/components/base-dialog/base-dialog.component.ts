import { Component, output } from '@angular/core';

@Component({
	selector: 'app-base-dialog',
	template: '',
})
export class BaseDialogComponent {
	readonly action = output<string>();

	handleAction(action: string) {
		this.action.emit(action);
	}
}
