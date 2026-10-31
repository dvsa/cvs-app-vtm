import { Locator, Page } from '@playwright/test';
import { Button } from '../../../components/button.component';
import { Section, fillFields } from '../../../components/section.component';

export class DefectsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'defects');
	}

	readonly addDefectButton = new Button(this.content, 'add-defect-button');
	readonly downloadAllMediaButton = new Button(this.content, 'download-all-media-button');
	readonly defectLinks = this.content.locator('a[data-action="retain-data"]');

	// Defects are edited on a separate screen, not in this accordion.
	async fill(values: Record<string, never>): Promise<void> {
		await this.open();
		await fillFields({}, values);
	}
}
