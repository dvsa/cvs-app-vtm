import type { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { expect } from '@playwright/test';
import type { PageFactory } from '../../../page-objects/page.factory';

export async function addDefect(pages: PageFactory, defect: DefectDetailsSchema): Promise<void> {
	const section = pages.createTestResultPage.defects;
	await section.open();
	await section.addDefectButton.click();
	const select = pages.selectDefectPage;
	await select.searchInput.fill(String(defect.imNumber));
	await select.searchButton.click();
	const reference = `${defect.imNumber}.${defect.itemNumber} (${defect.deficiencyId})`;
	await select.deficiency(reference).click();
	const edit = pages.editDefectPage;
	await expect(edit.heading).toBeVisible();
	await edit.frontLocation.check();
	await edit.notes.fill(defect.additionalInformation.notes);
	await edit.repairedDuringTest.setChecked(defect.prs === true);
	await edit.confirmButton.click();
	await expect(section.defectLinks).toHaveText([defect.deficiencyRef]);
}
