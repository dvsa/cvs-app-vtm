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
    return testResult?.createdByName?.length === 0 || !testResult?.createdByName ? testResult?.testerName : testResult?.createdByName;
  }

  sortedTestHistory(testResult: TestResultModel[] | undefined): TestResultModel[] | undefined {
    let newarr: TestResultModel[] | undefined = testResult
      ?.filter((item): item is TestResultModel => !!item.createdAt)
      .sort((a, b) => {
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      });

    let notFound: TestResultModel[] | undefined = testResult?.filter((item): item is TestResultModel => !item.createdAt);

    if (notFound) {
      return newarr?.concat(notFound);
    } else {
      return newarr;
    }
  }
}
