import { Injectable, inject } from '@angular/core';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';

@Injectable({
	providedIn: 'root',
})
export class DTOLayer {
	featureToggleService = inject(FeatureToggleService);

	transformPayload(editingTestResult: TestResultSchema) {
		if (
			!this.featureToggleService.isFeatureEnabled('testresultcreate') ||
			!this.featureToggleService.isFeatureEnabled('testresultamend')
		) {
			return editingTestResult;
		}
		const payload = this.stripCentralDocsForNonApplicableTestTypes(editingTestResult);

		return this.stripTestAnniversaryDate(payload);
	}

	private stripTestAnniversaryDate(editingTestResult: TestResultSchema): TestResultSchema {
		// transformPayload is called for Creations only. When creating a record, there should be no testAnniversaryDate
		return {
			...editingTestResult,
			testTypes: editingTestResult.testTypes.map(({ testAnniversaryDate, ...testType }) => testType),
		};
	}

	private stripCentralDocsForNonApplicableTestTypes(editingTestResult: TestResultSchema): TestResultSchema {
		return {
			...editingTestResult,
			testTypes: editingTestResult.testTypes.map((testType) => {
				if (!TEST_TYPES_GROUP9_10_CENTRAL_DOCS.includes(testType.testTypeId)) {
					const { centralDocs, ...testTypeWithoutCentralDocs } = testType;
					return testTypeWithoutCentralDocs;
				}
				return testType;
			}),
		};
	}
}
