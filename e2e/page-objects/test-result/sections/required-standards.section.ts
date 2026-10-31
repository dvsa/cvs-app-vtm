import { Locator, Page } from '@playwright/test';
import { Button } from '../../../components/button.component';
import { Section, fillFields } from '../../../components/section.component';

export class RequiredStandardsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'requiredStandards');
	}

	readonly addRequiredStandardButton = new Button(this.content, 'add-rs-button');
	readonly requiredStandardLinks = this.content.locator('a[data-action="retain-data"]');

	// Required standards are edited on a separate screen, not in this accordion.
	async fill(values: Record<string, never>): Promise<void> {
		await this.open();
		await fillFields({}, values);
	}
}
