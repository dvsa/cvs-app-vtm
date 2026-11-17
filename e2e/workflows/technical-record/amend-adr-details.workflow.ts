import { expect } from '@playwright/test';
import type { AdrDetails } from '../../builders/helpers/adr';
import type { PageFactory } from '../../page-objects/page.factory';

export async function amendAdrDetails(pages: PageFactory, details: AdrDetails, reason: string): Promise<void> {
	await pages.viewTechnicalRecordPage.amendButton.click();
	await pages.amendTechnicalRecordReasonPage.correctingAnError.check();
	await pages.amendTechnicalRecordReasonPage.continueButton.click();
	const amend = pages.amendTechnicalRecordPage;
	await expect(amend.heading).toBeVisible();
	await amend.clearFilters();
	await amend.adr.fillFromRecord(details);
	await amend.reasonForCreation.fillFromRecord({ techRecord_reasonForCreation: reason });
	await amend.reviewButton.click();
	const review = pages.amendTechnicalRecordChangesSummaryPage;
	await expect(review.heading).toBeVisible();
	await review.submitButton.click();
	await expect(pages.page).toHaveURL(/\/tech-records\/[^/]+\/[^/?]+(?:\?.*)?$/);
	await expect(pages.viewTechnicalRecordPage.heading).toBeVisible();
}
