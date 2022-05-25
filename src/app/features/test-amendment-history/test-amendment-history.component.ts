import { Component, Input } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';

@Component({
  selector: 'app-test-amendment-history',
  templateUrl: './test-amendment-history.component.html',
  styleUrls: ['./test-amendment-history.component.scss']
})
export class TestAmendmentHistoryComponent {
  @Input() testRecord: TestResultModel | undefined;

  constructor() {}

  getCreatedByName(testResult: TestResultModel | undefined) {
    return !testResult?.createdByName ? testResult?.testerName : testResult?.createdByName;
  }

  getTestVersion(testVersion: string | null | undefined): string {
    if (testVersion) {
      return testVersion;
    } else if (!this.testRecord?.testHistory) {
      return 'Current';
    } else {
      return '';
    }
  }

  sortedTestHistory(testResult: TestResultModel[] | undefined): TestResultModel[] | undefined {
    let sortedArray: TestResultModel[] | undefined = testResult
      ?.filter((item): item is TestResultModel => !!item.createdAt)
      .sort((a, b) => {
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      });

    let notFound: TestResultModel[] | undefined = testResult?.filter((item): item is TestResultModel => !item.createdAt);

    if (notFound) {
      return sortedArray?.concat(notFound);
    } else {
      return sortedArray;
    }
  }
}
