import { expect } from '@playwright/test';
import type { BatchDefinition } from '../../builders/batch.builder';
import type { PageFactory } from '../../page-objects/page.factory';

export async function openBatchCreation(pages: PageFactory): Promise<void> {
	await pages.page.goto('/');
	const link = pages.page.getByRole('link', { name: 'Create a batch of technical records', exact: true });
	await expect(link).toHaveAttribute('href', '/batch/enter-details');
	await link.click();
	await expect(pages.enterBatchDetailsPage.heading).toBeVisible();
	await expect(pages.page).toHaveURL(/\/batch\/enter-details$/);
}

export async function startBatchCreation(pages: PageFactory, batch: BatchDefinition): Promise<void> {
	await openBatchCreation(pages);
	const details = pages.enterBatchDetailsPage;
	await details.fill(batch);
	if (batch.vehicleType === 'trl' && batch.status === 'current') {
		await expect(details.tes1).toBeChecked();
		await expect(details.tes1).toBeDisabled();
		await expect(details.tes2).toBeDisabled();
		await expect(details.trailerFormTypeHint).toBeVisible();
	}
	await details.continueButton.click();
	await expect(pages.enterBatchSizePage.heading).toBeVisible();
	await pages.enterBatchSizePage.size.fill(batch.vehicles.length);
	await pages.enterBatchSizePage.continueButton.click();
	await expect(pages.enterBatchIdentifiersPage.heading).toBeVisible();
	await pages.enterBatchIdentifiersPage.fill(batch.vehicles);
	await pages.enterBatchIdentifiersPage.confirmButton.click();
	await expect(pages.enterTechRecordDetailsPage.heading).toBeVisible();
	await expect(pages.enterTechRecordDetailsPage.recordType).toHaveText(
		batch.status === 'current' ? 'Current' : 'Provisional'
	);
	if (batch.trailerFormType) {
		await expect(pages.enterTechRecordDetailsPage.trailerFormType).toHaveText(batch.trailerFormType.toUpperCase());
	}
}

export async function createBatch(pages: PageFactory, batch: BatchDefinition): Promise<void> {
	await startBatchCreation(pages, batch);
	await pages.enterTechRecordDetailsPage.fillBatch(batch.record);
	await pages.enterTechRecordDetailsPage.saveButton.click();
	await expect(pages.batchSummaryPage.heading).toBeVisible();
}
