import { Pipe, PipeTransform } from '@angular/core';
import { TestType } from '@models/test-types/testType';
import { TestTypeCategory } from '@models/test-types/testTypeCategory';

@Pipe({
	name: 'testTypeName',
})
export class TestTypeNamePipe implements PipeTransform {
	findTestTypeNameById(id: string, testTypes: Array<TestType | TestTypeCategory>): TestType | undefined {
		function idMatch(testType: TestType | TestTypeCategory) {
			if (testType.id === id) {
				result = testType;
				return true;
			}
			return (
				Object.prototype.hasOwnProperty.call(testType, 'nextTestTypesOrCategories') &&
				(testType as TestTypeCategory).nextTestTypesOrCategories?.some(idMatch)
			);
		}

		let result;
		testTypes.some(idMatch);
		return result;
	}

	transform(value: string, testTypes: Array<TestType | TestTypeCategory> | null): string {
		if (!testTypes) {
			return value;
		}

		const match = this.findTestTypeNameById(value, testTypes);

		if (!match) {
			return '-';
		}

		const { suggestedTestTypeDisplayName, testTypeName, name } = match;
		return suggestedTestTypeDisplayName || testTypeName || name || '-';
	}
}
