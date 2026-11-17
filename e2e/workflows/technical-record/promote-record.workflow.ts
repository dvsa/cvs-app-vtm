import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export async function promoteRecord(pages: PageFactory, reason: string): Promise<void> {
	await pages.viewTechnicalRecordPage.promoteLink.click();
	const change = pages.changeRecordStatusPage;
	await expect(change.heading).toHaveText('Promote technical record');
	await change.reason.fill(reason);
	await change.submitButton.click();
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
	await expect(pages.viewTechnicalRecordPage.statusCode).toHaveText('Current');
}
