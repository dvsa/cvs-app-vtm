import { Pipe, PipeTransform } from '@angular/core';
import { TestType, TestTypeCategory } from '@api/test-types';

@Pipe({
  name: 'testTypeName'
})
export class TestTypeNamePipe implements PipeTransform {
  findTestTypeNameById(id: string, testTypes: Array<TestType | TestTypeCategory>): string {
    const name =
      testTypes.find(testType => {
        if (testType.hasOwnProperty('nextTestTypesOrCategories')) {
          return this.findTestTypeNameById(id, (testType as TestTypeCategory).nextTestTypesOrCategories!!);
        }

        return testType.id === id;
      })?.name || '-';

    return name;
  }

  transform(value: string, testTypes: Array<TestType | TestTypeCategory> | null): unknown {
    if (!testTypes) {
      return value;
    }
    return this.findTestTypeNameById(value, testTypes);
  }
}
