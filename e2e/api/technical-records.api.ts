import { type APIRequestContext, expect } from '@playwright/test';
import type { TechnicalRecord } from '../page-objects/technical-record/technical-record.page';

export interface CreatedTechnicalRecord {
	systemNumber: string;
	createdTimestamp: string;
	vin: string;
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
		const current = records.filter(
			(record: unknown) =>
				typeof record === 'object' &&
				record !== null &&
				'systemNumber' in record &&
				record.systemNumber === systemNumber &&
				'techRecord_statusCode' in record &&
				record.techRecord_statusCode === 'current'
		);
		expect(current, `Expected one current technical record for ${systemNumber}`).toHaveLength(1);
		return this.parseRecord(current[0]);
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
