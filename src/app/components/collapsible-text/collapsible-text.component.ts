import { SlicePipe } from '@angular/common';
import { Component, input, model } from '@angular/core';

@Component({
	selector: 'collapsible-text',
	templateUrl: './collapsible-text.component.html',
	styleUrls: ['./collapsible-text.component.scss'],
	imports: [SlicePipe],
})
export class CollapsibleTextComponent {
	readonly text = input('');
	readonly maxChars = input(0);
	isCollapsed = model(true);

	open() {
		this.isCollapsed.set(false);
	}

	close() {
		this.isCollapsed.set(true);
	}
}
