import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';
import { unarchiveRecord } from './unarchive-record.workflow';

export async function unarchiveRecordAsProvisional(pages: PageFactory, reason: string): Promise<void> {
	const response = await unarchiveRecord(pages, 'provisional', reason);
	expect(response.ok(), `Unarchiving as provisional: ${await response.text()}`).toBe(true);
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
	await expect(pages.viewTechnicalRecordPage.statusCode).toHaveText('Provisional');
}
