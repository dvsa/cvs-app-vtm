import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export async function changeVrmViaCorrectingAnError(pages: PageFactory, newVrm: string): Promise<void> {
	await pages.viewTechnicalRecordPage.changeVrmLink.click();
	const reason = pages.changeVrmReasonPage;
	await expect(reason.heading).toBeVisible();
	await reason.correctingAnError.check();
	await reason.continueButton.click();

	const change = pages.changeVrmPage;
	await expect(change.heading).toBeVisible();
	await change.newVrm.fill(newVrm);
	await change.newVrm.locator.blur();
	await expect(change.newVrm.locator).toHaveClass(/\bng-valid\b/);
	await change.saveButton.click();
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
}
