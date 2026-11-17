import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export async function changeVtaVisibility(
	pages: PageFactory,
	visibility: 'hidden' | 'visible',
	reason: string
): Promise<void> {
	await pages.viewTechnicalRecordPage.changeVtaVisibilityLink.click();
	await expect(pages.page).toHaveURL(/\/change-vta-visibility$/);
	const change = pages.changeVtaVisibilityPage;
	await expect(change.heading).toBeVisible();
	await expect(change.actionHeading).toHaveText(`${visibility === 'hidden' ? 'Hide' : 'Show'} record in VTA`);
	await change.reason.fill(reason);
	await change.submitButton.click();
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
	await expect(pages.viewTechnicalRecordPage.vtaVisibility).toHaveText(visibility === 'hidden' ? 'Hidden' : 'Visible');
}
