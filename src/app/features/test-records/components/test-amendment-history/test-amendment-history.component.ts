import { Component, Input } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { select, Store } from '@ngrx/store';
import { selectedTestSortedAmendmentHistory } from '@store/test-records/selectors/test-records.selectors';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-test-amendment-history',
  templateUrl: './test-amendment-history.component.html'
})
export class TestAmendmentHistoryComponent {
  @Input() testRecord: TestResultModel | undefined;

  constructor(private store: Store) {}

  getCreatedByName(testResult: TestResultModel | undefined) {
    return testResult?.createdByName || testResult?.testerName;
  }

  get sortedTestHistory$(): Observable<TestResultModel[] | undefined> {
    return this.store.pipe(select(selectedTestSortedAmendmentHistory));
  }
}
