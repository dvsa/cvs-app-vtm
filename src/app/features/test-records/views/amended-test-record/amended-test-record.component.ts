import { Component, OnInit } from '@angular/core';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-amended-test-record',
  templateUrl: './amended-test-record.component.html'
})
export class AmendedTestRecordComponent implements OnInit {
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defects$: Observable<Defects | undefined> = of(undefined);

  constructor(private testRecordsService: TestRecordsService) {}

  ngOnInit() {
    this.testResult$ = this.testRecordsService.amendedTestResult$;
    this.defects$ = this.testRecordsService.amendedDefectData$;
  }
}
