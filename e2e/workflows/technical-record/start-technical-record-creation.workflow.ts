import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export interface TechnicalRecordIdentifiers {
	vin: string;
	primaryVrm?: string | null;
	trailerId?: string | null;
	techRecord_vehicleType: 'hgv' | 'psv' | 'trl' | 'small trl' | 'car' | 'lgv' | 'motorcycle';
	techRecord_statusCode: 'current' | 'provisional';
}

export async function startTechnicalRecordCreation(
	pages: PageFactory,
	record: TechnicalRecordIdentifiers
): Promise<void> {
	const identifier =
		record.techRecord_vehicleType === 'trl' || record.techRecord_vehicleType === 'small trl'
			? record.trailerId
			: record.primaryVrm;
	const create = pages.createTechnicalRecordPage;
	await pages.page.goto('/create');
	await expect(create.heading).toBeVisible();
	await create.vin.fill(record.vin);
	await create.generateId.fill(!identifier);
	if (identifier) {
		await create.vrmTrailerId.fill(identifier);
	}
	await create.vehicleStatus.fill(record.techRecord_statusCode);
	await create.vehicleType.fill(
		record.techRecord_vehicleType === 'small trl' ? 'small_trl' : record.techRecord_vehicleType
	);
	await create.continueButton.click();
	await expect(pages.page).toHaveURL(/\/create\/new-record-details(?:\?.*)?$/);
	await expect(pages.createTechnicalRecordDetailsPage.createRecordButton.locator).toBeVisible();
}
