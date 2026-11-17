import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';
import { unarchiveRecord } from './unarchive-record.workflow';

export async function unarchiveRecordAsCurrent(pages: PageFactory, reason: string): Promise<void> {
	const response = await unarchiveRecord(pages, 'current', reason);
	expect(response.ok(), `Unarchiving as current: ${await response.text()}`).toBe(true);
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
	await expect(pages.viewTechnicalRecordPage.statusCode).toHaveText('Current');
}
