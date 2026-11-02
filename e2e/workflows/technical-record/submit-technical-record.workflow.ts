import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export async function submitTechnicalRecord(pages: PageFactory): Promise<void> {
	await pages.createTechnicalRecordDetailsPage.createRecordButton.click();
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
}
