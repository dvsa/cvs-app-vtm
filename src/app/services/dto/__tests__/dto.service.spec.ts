import { TestBed } from '@angular/core/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { DTOLayer } from '../dto.service';

describe('DTOLayer', () => {
	let service: DTOLayer;
	const featureToggleService = { isFeatureEnabled: vi.fn<(feature: string) => boolean>() };
	const createResult = () =>
		createMockTestResult({
			testTypes: ['41', '1'].map((testTypeId) =>
				createMockTestType({
					testTypeId,
					testResult: TestResults.PASS,
					testAnniversaryDate: '2027-11-09',
					certificateNumber: `certificate-${testTypeId}`,
					centralDocs: { issueRequired: true, notes: 'Issue certificate', reasonsForIssue: ['Replacement'] },
				})
			),
		});

	beforeEach(() => {
		featureToggleService.isFeatureEnabled.mockReturnValue(true);
		TestBed.configureTestingModule({
			providers: [{ provide: FeatureToggleService, useValue: featureToggleService }],
		});
		service = TestBed.inject(DTOLayer);
	});

	it.each([
		[false, false],
		[false, true],
		[true, false],
	])('leaves the payload untouched when create=%s and amend=%s', (createEnabled, amendEnabled) => {
		featureToggleService.isFeatureEnabled.mockImplementation((feature) =>
			feature === 'testresultcreate' ? createEnabled : amendEnabled
		);
		const result = createResult();
		const original = structuredClone(result);

		expect(service.transformPayload(result)).toBe(result);
		expect(result).toEqual(original);
	});

	it('removes anniversary dates and retains central documents only for applicable tests without mutating input', () => {
		const result = createResult();
		const original = structuredClone(result);
		Object.freeze(result);
		Object.freeze(result.testTypes);
		result.testTypes.forEach(Object.freeze);

		const payload = service.transformPayload(result);

		const { testAnniversaryDate: firstAnniversary, ...firstTest } = original.testTypes[0];
		const { testAnniversaryDate: secondAnniversary, centralDocs, ...secondTest } = original.testTypes[1];
		expect(payload).toEqual({ ...original, testTypes: [firstTest, secondTest] });
		expect(result).toEqual(original);
	});

	it('accepts test types without optional fields and an empty test list', () => {
		const testType = createMockTestType({ testTypeId: '1' });
		delete testType.testAnniversaryDate;
		delete testType.centralDocs;
		const result = createMockTestResult({ testTypes: [testType] });

		expect(service.transformPayload(result)).toEqual(result);
		expect(service.transformPayload(createMockTestResult())).toEqual(createMockTestResult());
	});
});
