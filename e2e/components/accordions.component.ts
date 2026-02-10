import { BaseComponent } from './base.component';

export class AccordionsComponent extends BaseComponent {
	readonly showAllSectionsButton = this.page.getByRole('button', { name: 'Show all sections' });
	readonly hideAllSectionsButton = this.page.getByRole('button', { name: 'Hide all sections' });

	async isOpen() {
		return await this.showAllSectionsButton.isVisible();
	}

	async isClosed() {
		return await this.hideAllSectionsButton.isVisible();
	}

	async open() {
		if (await this.isOpen()) return;
		await this.showAllSectionsButton.click();
	}

	async close() {
		if (await this.isClosed()) return;
		await this.hideAllSectionsButton.click();
	}
}
