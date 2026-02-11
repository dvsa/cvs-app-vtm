import { BaseComponent } from './base.component';

export class AutoCompleteComponent extends BaseComponent {
	async fill(data?: string | number | null): Promise<void> {
		if (!data) return;
	}
}
