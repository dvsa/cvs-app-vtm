import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { expect, test } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import { changeVtaVisibility } from '../../workflows/technical-record/change-vta-visibility.workflow';
import { openTechnicalRecord } from '../../workflows/technical-record/open-technical-record.workflow';

test.describe('Change technical record visibility in VTA', { tag: ['@regression', '@technical-record'] }, () => {
	test('hides a visible testable HGV record in VTA and changes its completeness to skeleton', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(
			new HgvBuilder().current().testable().withVrm().build({ techRecord_hiddenInVta: false })
		);
		await openTechnicalRecord(pages, record);
		const view = pages.viewTechnicalRecordPage;
		await expect(view.vtaVisibility).toHaveText('Visible');
		await expect(view.recordCompleteness).toHaveText('testable');

		await changeVtaVisibility(pages, 'hidden', 'Hide the record from VTA');
		await expect(view.vin).toHaveText(record.vin);
		await expect(view.recordCompleteness).toHaveText('skeleton');
		await page.reload();
		await expect(view.vin).toHaveText(record.vin);
		await expect(view.vtaVisibility).toHaveText('Hidden');
		await expect(view.recordCompleteness).toHaveText('skeleton');
	});

	test('shows a hidden PSV record in VTA and restores its complete status', async ({ page, technicalRecordsApi }) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(
			new PsvBuilder().current().complete().withVrm().build({ techRecord_hiddenInVta: true })
		);
		await openTechnicalRecord(pages, record);
		const view = pages.viewTechnicalRecordPage;
		await expect(view.vtaVisibility).toHaveText('Hidden');
		await expect(view.recordCompleteness).toHaveText('skeleton');

		await changeVtaVisibility(pages, 'visible', 'Show the record in VTA');
		await expect(view.vin).toHaveText(record.vin);
		await expect(view.recordCompleteness).toHaveText('complete');
		await page.reload();
		await expect(view.vin).toHaveText(record.vin);
		await expect(view.vtaVisibility).toHaveText('Visible');
		await expect(view.recordCompleteness).toHaveText('complete');
	});
});
