import * as fs from 'node:fs';
import { TestType } from '@models/test-types/testType';
import { TEST_TYPES } from '@models/testTypeId.enum';

const response = await fetch(
	'https://raw.githubusercontent.com/dvsa/cvs-svc-test-types/refs/heads/develop/tests/resources/test-types.json'
);
const TestTypeJson = await response.json();

const generateTestTypeLookups = (sourceData: TestType[], testTypeGroups: typeof TEST_TYPES) => {
	const lookups: Record<string, unknown> = {};

	const findTestTypes = (data: TestType[], testTypeIds: string[]) => {
		const results: string[] = [];

		const recursiveSearch = (item: TestType & { nextTestTypesOrCategories: TestType[] }) => {
			if (testTypeIds.includes(item.id)) {
				results.push(`${item.id} - ${item.testTypeName} - ${item.forVehicleType}`);
			}

			for (const nestedItem of item.nextTestTypesOrCategories ?? []) {
				recursiveSearch(nestedItem as TestType & { nextTestTypesOrCategories: TestType[] });
			}
		};

		for (const item of data) {
			recursiveSearch(item as TestType & { nextTestTypesOrCategories: TestType[] });
		}

		return results;
	};

	for (const [groupKey, groupIds] of Object.entries(testTypeGroups)) {
		lookups[groupKey] = findTestTypes(sourceData, groupIds);
	}

	return lookups;
};

const msg = 'Generating Test Type Groupings...';

console.time(msg);

// @ts-ignore
const testTypeLookups = generateTestTypeLookups(TestTypeJson, TEST_TYPES);

const out_path = `${__dirname}/test-type-groupings.json`;

fs.writeFileSync(out_path, JSON.stringify(testTypeLookups, null, 2));

console.timeEnd(msg);

console.log(`\nGenerated to ${out_path}`);
