import { expect } from '@playwright/test';
import type { CreatedTechnicalRecord } from '../../api/technical-records.api';
import type { PageFactory } from '../../page-objects/page.factory';

export async function openTechnicalRecord(pages: PageFactory, record: CreatedTechnicalRecord): Promise<void> {
	await pages.page.goto(
		`/tech-records/${encodeURIComponent(record.systemNumber)}/${encodeURIComponent(record.createdTimestamp)}`
	);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
	await expect(pages.viewTechnicalRecordPage.vin).toHaveText(record.vin);
}
