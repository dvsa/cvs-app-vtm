import { type APIRequestContext, expect } from '@playwright/test';
import type { TechnicalRecord } from '../page-objects/technical-record/technical-record.page';

export interface CreatedTechnicalRecord {
	systemNumber: string;
	createdTimestamp: string;
	vin: string;
}

export type RecordStatus = 'current' | 'provisional' | 'archived';

export interface TechnicalRecordVersion extends CreatedTechnicalRecord {
	techRecord_statusCode: RecordStatus;
}

export class TechnicalRecordsApi {
	constructor(
		private readonly request: APIRequestContext,
		private readonly baseURL: string,
		private readonly accessToken: string
	) {}

	async create(record: TechnicalRecord): Promise<CreatedTechnicalRecord> {
		const response = await this.request.post(`${this.baseURL.replace(/\/+$/, '')}/tech-records/v4`, {
			headers: { Authorization: `Bearer ${this.accessToken}` },
			data: record,
		});
		expect(response.status(), `Creating technical record: ${await response.text()}`).toBe(201);

		const created = this.parseRecord(await response.json());
		expect(created.vin).toBe(record.vin);
		return created;
	}

	async getCurrent(systemNumber: string): Promise<CreatedTechnicalRecord> {
		const records = await this.getRecords(systemNumber);
		const current = records.filter((record) => record.techRecord_statusCode === 'current');
		expect(current, `Expected one current technical record for ${systemNumber}`).toHaveLength(1);
		return current[0];
	}

	async update(record: CreatedTechnicalRecord, changes: TechnicalRecord): Promise<CreatedTechnicalRecord> {
		expect(changes.vin, 'Record versions must belong to the same vehicle').toBe(record.vin);
		const response = await this.request.patch(
			`${this.baseURL.replace(/\/+$/, '')}/tech-records/v4/${encodeURIComponent(record.systemNumber)}/${encodeURIComponent(record.createdTimestamp)}`,
			{
				headers: { Authorization: `Bearer ${this.accessToken}` },
				data: changes,
			}
		);
		expect(response.status(), `Updating technical record: ${await response.text()}`).toBe(200);
		const updated = this.parseRecord(await response.json());
		expect(updated.systemNumber).toBe(record.systemNumber);
		expect(updated.vin).toBe(record.vin);
		return updated;
	}

	async archive(record: CreatedTechnicalRecord, reason: string): Promise<CreatedTechnicalRecord> {
		const response = await this.request.patch(
			`${this.baseURL.replace(/\/+$/, '')}/tech-records/v4/archive/${encodeURIComponent(record.systemNumber)}/${encodeURIComponent(record.createdTimestamp)}`,
			{
				headers: { Authorization: `Bearer ${this.accessToken}` },
				data: { reasonForArchiving: reason },
			}
		);
		expect(response.status(), `Archiving technical record: ${await response.text()}`).toBe(200);
		const archived = this.parseRecord(await response.json());
		expect(archived.systemNumber).toBe(record.systemNumber);
		expect(archived.vin).toBe(record.vin);
		return archived;
	}

	async getRecords(systemNumber: string): Promise<TechnicalRecordVersion[]> {
		const response = await this.request.get(
			`${this.baseURL.replace(/\/+$/, '')}/tech-records/v4/search/${encodeURIComponent(systemNumber)}`,
			{
				headers: { Authorization: `Bearer ${this.accessToken}` },
				params: { searchCriteria: 'systemNumber', additionalInfo: true },
			}
		);
		expect(response.status(), `Finding current technical record: ${await response.text()}`).toBe(200);
		const records: unknown = await response.json();
		if (!Array.isArray(records)) {
			throw new Error('Technical record search API response must be an array.');
		}
		return records.map((record: unknown) => {
			const reference = this.parseRecord(record);
			expect(reference.systemNumber).toBe(systemNumber);
			if (
				typeof record !== 'object' ||
				record === null ||
				!('techRecord_statusCode' in record) ||
				(record.techRecord_statusCode !== 'current' &&
					record.techRecord_statusCode !== 'provisional' &&
					record.techRecord_statusCode !== 'archived')
			) {
				throw new Error('Technical record search API response must contain a valid record status.');
			}
			return { ...reference, techRecord_statusCode: record.techRecord_statusCode };
		});
	}

	private parseRecord(created: unknown): CreatedTechnicalRecord {
		if (
			typeof created !== 'object' ||
			created === null ||
			!('systemNumber' in created) ||
			typeof created.systemNumber !== 'string' ||
			!created.systemNumber ||
			!('createdTimestamp' in created) ||
			typeof created.createdTimestamp !== 'string' ||
			!created.createdTimestamp ||
			!('vin' in created) ||
			typeof created.vin !== 'string'
		) {
			throw new Error('Technical record API response must contain systemNumber, createdTimestamp and VIN.');
		}
		return {
			systemNumber: created.systemNumber,
			createdTimestamp: created.createdTimestamp,
			vin: created.vin,
		};
	}
}
