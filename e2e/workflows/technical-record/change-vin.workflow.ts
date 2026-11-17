import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export async function changeVin(pages: PageFactory, vin: string): Promise<void> {
	await pages.viewTechnicalRecordPage.changeVinLink.click();
	const change = pages.changeVinPage;
	await expect(change.heading).toBeVisible();
	await change.vin.fill(vin);
	await change.saveButton.click();
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
	await expect(pages.viewTechnicalRecordPage.vin).toHaveText(vin);
}
