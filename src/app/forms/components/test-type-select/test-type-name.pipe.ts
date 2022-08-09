import { Pipe, PipeTransform } from '@angular/core';
import { TestType, TestTypeCategory } from '@api/test-types';

@Pipe({
  name: 'testTypeName'
})
export class TestTypeNamePipe implements PipeTransform {
  findTestTypeNameById(id: string, testTypes: Array<TestType | TestTypeCategory>): TestType | undefined {
    function idMatch(testType: TestType | TestTypeCategory) {
      if (testType.id === id) {
        result = testType;
        return true;
      }

      return testType.hasOwnProperty('nextTestTypesOrCategories') && (testType as TestTypeCategory).nextTestTypesOrCategories!!.some(idMatch);
    }

    let result;
    testTypes.some(idMatch);
    return result;
  }

  transform(value: string, testTypes: Array<TestType | TestTypeCategory> | null): unknown {
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
