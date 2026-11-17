import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { LgvBuilder } from '../../builders/vehicle/lgv.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { generateVrm } from '../../builders/vehicle/vehicle.builder';
import { expect, test } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import { changeVrmViaCherishedTransferWithThirdMark } from '../../workflows/technical-record/change-vrm-via-cherished-transfer-with-third-mark.workflow';
import { changeVrmViaCherishedTransfer } from '../../workflows/technical-record/change-vrm-via-cherished-transfer.workflow';
import { changeVrmViaCorrectingAnError } from '../../workflows/technical-record/change-vrm-via-correcting-an-error.workflow';
import { openTechnicalRecord } from '../../workflows/technical-record/open-technical-record.workflow';

function vrmText(vrm: string): RegExp {
	return new RegExp(`^\\s*${vrm.split('').join('\\s*')}\\s*$`);
}

test.describe('Change vehicle VRM', { tag: ['@regression', '@technical-record'] }, () => {
	test('changes an LGV VRM by correcting an error without archiving the incorrect VRM', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new LgvBuilder().provisional().skeleton().withVrm().build());
		await openTechnicalRecord(pages, record);
		await expect(pages.viewTechnicalRecordPage.previousVrm).toHaveText('Not applicable');

		const newVrm = generateVrm();
		await changeVrmViaCorrectingAnError(pages, newVrm);

		const view = pages.viewTechnicalRecordPage;
		await expect(view.vin).toHaveText(record.vin);
		await expect(view.vrm).toHaveText(vrmText(newVrm));
		await expect(view.previousVrm).toHaveText('Not applicable');
		await page.reload();
		await expect(view.vrm).toHaveText(vrmText(newVrm));
		await expect(view.previousVrm).toHaveText('Not applicable');
	});

	test('changes an HGV VRM by cherished transfer without a third mark and retains the previous VRM', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const previousVrm = generateVrm();
		const record = await technicalRecordsApi.create(
			new HgvBuilder().provisional().skeleton().withVrm(previousVrm).build()
		);
		await openTechnicalRecord(pages, record);

		const newVrm = generateVrm();
		await changeVrmViaCherishedTransfer(pages, newVrm);

		const view = pages.viewTechnicalRecordPage;
		await expect(view.vin).toHaveText(record.vin);
		await expect(view.vrm).toHaveText(vrmText(newVrm));
		await expect(view.previousVrm).toHaveText(vrmText(previousVrm));
		await page.reload();
		await expect(view.vrm).toHaveText(vrmText(newVrm));
		await expect(view.previousVrm).toHaveText(vrmText(previousVrm));
	});

	test('changes a PSV VRM by cherished transfer with a third mark and updates both vehicles', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const transferredVrm = generateVrm();
		const donor = await technicalRecordsApi.create(
			new PsvBuilder().current().skeleton().withVrm(transferredVrm).build()
		);
		const previousVrm = generateVrm();
		const recipient = await technicalRecordsApi.create(
			new PsvBuilder().provisional().skeleton().withVrm(previousVrm).build()
		);
		await openTechnicalRecord(pages, recipient);

		const thirdMark = generateVrm();
		await changeVrmViaCherishedTransferWithThirdMark(pages, transferredVrm, thirdMark);

		const view = pages.viewTechnicalRecordPage;
		await expect(view.vin).toHaveText(recipient.vin);
		await expect(view.vrm).toHaveText(vrmText(transferredVrm));
		await expect(view.previousVrm).toHaveText(vrmText(previousVrm));
		await page.reload();
		await expect(view.vrm).toHaveText(vrmText(transferredVrm));
		await expect(view.previousVrm).toHaveText(vrmText(previousVrm));

		await openTechnicalRecord(pages, await technicalRecordsApi.getCurrent(donor.systemNumber));
		await expect(view.vrm).toHaveText(vrmText(thirdMark));
		await expect(view.previousVrm).toHaveText(vrmText(transferredVrm));
	});
});
