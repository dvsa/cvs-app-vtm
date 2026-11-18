import type { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { type APIRequestContext, expect } from '@playwright/test';

export type TestVisit = Pick<
	TestResultSchema,
	'testStationName' | 'testStationPNumber' | 'testStationType' | 'testerName' | 'testerStaffId' | 'testerEmailAddress'
>;

export class TestResultsApi {
	constructor(
		private readonly request: APIRequestContext,
		private readonly baseURL: string,
		private readonly accessToken: string
	) {}

	async getVisit(): Promise<TestVisit> {
		const [stationsResponse, usersResponse] = await Promise.all([
			this.request.get(`${this.baseURL}/test-stations`, { headers: this.headers }),
			this.request.get(`${this.baseURL}/reference/USER`, { headers: this.headers }),
		]);
		expect(stationsResponse.status(), 'Loading test stations').toBe(200);
		expect(usersResponse.status(), 'Loading testers').toBe(200);
		const stations: Array<TestVisit & { testStationStatus: string }> = await stationsResponse.json();
		const users: { data: Array<{ resourceKey: string; name: string; email: string }> } = await usersResponse.json();
		const station = stations.find(
			(item) => item.testStationStatus === 'active' && item.testStationType === 'atf' && item.testStationPNumber
		);
		const tester = users.data.find((item) => item.resourceKey && item.name && item.email);
		if (!station || !tester) throw new Error('Contingency setup requires an active ATF and a valid tester.');
		return {
			testStationName: station.testStationName,
			testStationPNumber: station.testStationPNumber,
			testStationType: station.testStationType,
			testerName: tester.name,
			testerStaffId: tester.resourceKey,
			testerEmailAddress: tester.email,
		};
	}

	async create(record: TestResultSchema): Promise<TestResultSchema> {
		const response = await this.request.post(`${this.baseURL}/test-results`, {
			headers: this.headers,
			data: {
				...record,
				testTypes: record.testTypes.map((type) => ({
					...type,
					// Taxonomy metadata is FE-only and is rejected by the POST schema.
					defects: type.defects.map(({ metadata: _metadata, ...defect }) => defect),
				})),
			},
		});
		expect(response.status(), `Creating test result: ${await response.text()}`).toBe(201);
		const created: unknown = await response.json();
		if (
			typeof created !== 'object' ||
			created === null ||
			!('testNumbers' in created) ||
			!Array.isArray(created.testNumbers) ||
			created.testNumbers.length !== record.testTypes.length ||
			!created.testNumbers.every((number: unknown) => typeof number === 'string' && number.length > 0)
		) {
			throw new Error('Test creation response must contain a generated number for each test type.');
		}
		const result = await this.get(record.systemNumber, record.testResultId);
		expect(result.vin).toBe(record.vin);
		expect(result.testTypes[0].testResult).toBe(record.testTypes[0].testResult);
		expect(result.testTypes.map((type) => type.testNumber)).toEqual(created.testNumbers);
		return result;
	}

	async get(systemNumber: string, testResultId: string): Promise<TestResultSchema> {
		const response = await this.request.get(`${this.baseURL}/test-results/${encodeURIComponent(systemNumber)}`, {
			headers: this.headers,
			params: { testResultId, version: 'all' },
		});
		expect(response.status(), `Reading test result: ${await response.text()}`).toBe(200);
		const records: TestResultSchema[] = await response.json();
		expect(Array.isArray(records), 'Test results API response must be an array').toBe(true);
		const matching = records.filter((record) => record.testResultId === testResultId);
		expect(matching, 'Expected exactly one current test with its amendment history').toHaveLength(1);
		expect(matching[0].systemNumber).toBe(systemNumber);
		return matching[0];
	}

	private get headers() {
		return { Authorization: `Bearer ${this.accessToken}` };
	}
}
