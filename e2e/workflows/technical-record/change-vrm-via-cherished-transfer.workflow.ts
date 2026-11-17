import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export async function changeVrmViaCherishedTransfer(
	pages: PageFactory,
	currentVrm: string,
	thirdMark?: string
): Promise<void> {
	await pages.viewTechnicalRecordPage.changeVrmLink.click();
	const reason = pages.changeVrmReasonPage;
	await expect(reason.heading).toBeVisible();
	await reason.cherishedTransfer.check();
	await reason.continueButton.click();

	const change = pages.changeVrmPage;
	await expect(change.heading).toBeVisible();
	await change.currentVrm.fill(currentVrm);
	if (thirdMark) {
		await change.thirdMark.fill(thirdMark);
		await change.thirdMark.locator.blur();
		await expect(change.thirdMark.locator).toHaveClass(/\bng-valid\b/);
	} else {
		await change.currentVrm.locator.blur();
	}
	await expect(change.currentVrm.locator).toHaveClass(/\bng-valid\b/);
	await change.saveButton.click();
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
}
