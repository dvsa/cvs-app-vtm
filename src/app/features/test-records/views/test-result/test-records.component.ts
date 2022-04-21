import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestResultModel } from '@models/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';
import { PsvAnnual } from 'src/app/forms/templates/psv/psv-annual.template';
import { FormNode } from 'src/app/forms/services/dynamic-form.service';
@Component({
  selector: 'app-test-records',
  templateUrl: './test-records.component.html',
  styleUrls: ['./test-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent {
  testResult$: Observable<TestResultModel | undefined>;
  schema: FormNode;

  constructor(private testRecordsService: TestRecordsService) {
    this.testResult$ = this.testRecordsService.testResult$;
    this.schema = PsvAnnual;
  }
}
