import type { CreatedTechnicalRecord, RecordStatus, TechnicalRecordsApi } from '../../api/technical-records.api';
import { CarBuilder } from '../../builders/vehicle/car.builder';
import { HgvBuilder } from '../../builders/vehicle/hgv.builder';
import { LgvBuilder } from '../../builders/vehicle/lgv.builder';
import { MotorcycleBuilder } from '../../builders/vehicle/motorcycle.builder';
import { PsvBuilder } from '../../builders/vehicle/psv.builder';
import { SmallTrlBuilder } from '../../builders/vehicle/small-trl.builder';
import { TrlBuilder } from '../../builders/vehicle/trl.builder';
import { expect, test } from '../../fixtures/api.fixture';
import { PageFactory } from '../../page-objects/page.factory';
import type { TechnicalRecord } from '../../page-objects/technical-record/technical-record.page';
import { archiveRecord } from '../../workflows/technical-record/archive-record.workflow';
import { openTechnicalRecord } from '../../workflows/technical-record/open-technical-record.workflow';
import { promoteRecord } from '../../workflows/technical-record/promote-record.workflow';
import { unarchiveRecord } from '../../workflows/technical-record/unarchive-record.workflow';

const reason = 'Status transition regression test';

async function expectActiveStatuses(
	api: TechnicalRecordsApi,
	systemNumber: string,
	statuses: Array<Exclude<RecordStatus, 'archived'>>
): Promise<void> {
	await expect
		.poll(async () =>
			(await api.getRecords(systemNumber))
				.filter((record) => record.techRecord_statusCode !== 'archived')
				.map((record) => record.techRecord_statusCode)
				.sort()
		)
		.toEqual([...statuses].sort());
}

async function createRecordVersions(api: TechnicalRecordsApi, record: TechnicalRecord) {
	const current = await api.create(record);
	const provisional = await api.update(current, {
		...record,
		techRecord_statusCode: 'provisional',
		techRecord_reasonForCreation: 'Notifiable alteration required',
	});
	await expectActiveStatuses(api, current.systemNumber, ['current', 'provisional']);
	return { current, provisional };
}

async function verifyRecordStatus(
	pages: PageFactory,
	record: CreatedTechnicalRecord,
	status: 'Current' | 'Provisional' | 'Archived'
): Promise<void> {
	const view = pages.viewTechnicalRecordPage;
	await expect(view.heading).toBeVisible();
	await expect(view.vin).toHaveText(record.vin);
	await expect(view.statusCode).toHaveText(status);
	await pages.page.reload();
	await expect(view.statusCode).toHaveText(status);
}

async function verifyRejectedUnarchive(
	pages: PageFactory,
	api: TechnicalRecordsApi,
	archived: CreatedTechnicalRecord,
	status: 'current' | 'provisional'
): Promise<void> {
	const before = await api.getRecords(archived.systemNumber);
	await openTechnicalRecord(pages, archived);
	const response = await unarchiveRecord(pages, status, reason);
	expect(response.status()).toBe(400);
	await expect(pages.unarchiveRecordPage.errorSummary).toContainText('Unable to unarchive technical record');
	await expect(pages.unarchiveRecordPage.errorSummary).toContainText(
		'Cannot unarchive a record with non-archived records'
	);
	await expect(pages.page).toHaveURL(/\/unarchive-record$/);
	await expect(pages.unarchiveRecordPage.submitButton.locator).toBeVisible();

	const after = await api.getRecords(archived.systemNumber);
	expect(after).toHaveLength(before.length);
	expect(after).toEqual(expect.arrayContaining(before));
	await openTechnicalRecord(pages, archived);
	await verifyRecordStatus(pages, archived, 'Archived');
}

test.describe('Change technical record status', { tag: ['@regression', '@technical-record'] }, () => {
	test('promotes an LGV provisional record to current when no current record exists', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const record = await technicalRecordsApi.create(new LgvBuilder().provisional().skeleton().withVrm().build());
		await expectActiveStatuses(technicalRecordsApi, record.systemNumber, ['provisional']);
		await openTechnicalRecord(pages, record);
		await promoteRecord(pages, reason);

		await verifyRecordStatus(pages, record, 'Current');
		await expectActiveStatuses(technicalRecordsApi, record.systemNumber, ['current']);
	});

	test('archives an HGV provisional record without changing its current record', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const { current, provisional } = await createRecordVersions(
			technicalRecordsApi,
			new HgvBuilder().current().skeleton().withVrm().build()
		);
		await openTechnicalRecord(pages, provisional);
		await archiveRecord(pages, reason);

		await verifyRecordStatus(pages, provisional, 'Archived');
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['current']);
		await openTechnicalRecord(pages, current);
		await verifyRecordStatus(pages, current, 'Current');
	});

	test('archives a trailer current record without changing its provisional record', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const { current, provisional } = await createRecordVersions(
			technicalRecordsApi,
			new TrlBuilder().current().skeleton().withTrailerId().build()
		);
		await openTechnicalRecord(pages, current);
		await archiveRecord(pages, reason);

		await verifyRecordStatus(pages, current, 'Archived');
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['provisional']);
		await openTechnicalRecord(pages, provisional);
		await verifyRecordStatus(pages, provisional, 'Provisional');
	});

	test('rejects unarchiving a PSV record as current when only a provisional record exists', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const { current, provisional } = await createRecordVersions(
			technicalRecordsApi,
			new PsvBuilder().current().skeleton().withVrm().build()
		);
		const archived = await technicalRecordsApi.archive(current, reason);
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['provisional']);
		await verifyRejectedUnarchive(pages, technicalRecordsApi, archived, 'current');
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['provisional']);
		await openTechnicalRecord(pages, provisional);
		await verifyRecordStatus(pages, provisional, 'Provisional');
	});

	test('rejects unarchiving a car record as provisional when only a current record exists', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const { current, provisional } = await createRecordVersions(
			technicalRecordsApi,
			new CarBuilder().current().skeleton().withVrm().build()
		);
		const archived = await technicalRecordsApi.archive(provisional, reason);
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['current']);
		await verifyRejectedUnarchive(pages, technicalRecordsApi, archived, 'provisional');
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['current']);
		await openTechnicalRecord(pages, current);
		await verifyRecordStatus(pages, current, 'Current');
	});

	test('rejects unarchiving a motorcycle record as provisional when a provisional record already exists', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const { current, provisional } = await createRecordVersions(
			technicalRecordsApi,
			new MotorcycleBuilder().current().skeleton().withVrm().build()
		);
		const archived = await technicalRecordsApi.archive(current, reason);
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['provisional']);
		await verifyRejectedUnarchive(pages, technicalRecordsApi, archived, 'provisional');
		await openTechnicalRecord(pages, provisional);
		await verifyRecordStatus(pages, provisional, 'Provisional');
	});

	test('rejects unarchiving a small trailer record as current when a current record already exists', async ({
		page,
		technicalRecordsApi,
	}) => {
		const pages = new PageFactory(page);
		const { current, provisional } = await createRecordVersions(
			technicalRecordsApi,
			new SmallTrlBuilder().current().skeleton().withTrailerId().build()
		);
		const archived = await technicalRecordsApi.archive(provisional, reason);
		await expectActiveStatuses(technicalRecordsApi, current.systemNumber, ['current']);
		await verifyRejectedUnarchive(pages, technicalRecordsApi, archived, 'current');
		await openTechnicalRecord(pages, current);
		await verifyRecordStatus(pages, current, 'Current');
	});
});
