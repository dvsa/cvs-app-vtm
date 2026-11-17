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

		const created: unknown = await response.json();
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
			throw new Error('Create technical record API response must contain systemNumber, createdTimestamp and VIN.');
		}
		expect(created.vin).toBe(record.vin);
		return {
			systemNumber: created.systemNumber,
			createdTimestamp: created.createdTimestamp,
			vin: created.vin,
		};
	}
}
