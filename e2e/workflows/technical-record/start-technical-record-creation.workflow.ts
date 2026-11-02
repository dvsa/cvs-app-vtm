import { expect } from '@playwright/test';
import type { PageFactory } from '../../page-objects/page.factory';

export interface TechnicalRecordIdentifiers {
	generateId: boolean;
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
	const identifier = record.trailerId ?? record.primaryVrm;
	if (!record.generateId && !identifier) throw new Error('Technical record creation requires a VRM or trailer ID.');
	const create = pages.createTechnicalRecordPage;
	await pages.page.goto('/create');
	await expect(create.heading).toBeVisible();
	await create.vin.fill(record.vin);
	await create.generateId.fill(record.generateId);
	if (!record.generateId && identifier) {
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
