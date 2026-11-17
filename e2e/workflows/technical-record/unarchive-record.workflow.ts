import { type Response, expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export async function unarchiveRecord(
	pages: PageFactory,
	status: 'current' | 'provisional',
	reason: string
): Promise<Response> {
	await pages.viewTechnicalRecordPage.unarchiveLink.click();
	await expect(pages.page).toHaveURL(/\/unarchive-record(?:\?.*)?$/);
	const unarchive = pages.unarchiveRecordPage;
	await expect(unarchive.submitButton.locator).toBeVisible();
	await unarchive.status.fill(status);
	await unarchive.reason.fill(reason);
	const [response] = await Promise.all([
		pages.page.waitForResponse(
			(response) => response.request().method() === 'POST' && /\/tech-records\/v4\/unarchive\//.test(response.url())
		),
		unarchive.submitButton.click(),
	]);
	return response;
}
