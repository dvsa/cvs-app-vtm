import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { PsvAnnual } from '@forms/templates/psv/psv-annual.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';
import { FormNode } from 'src/app/forms/services/dynamic-form.types';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent {
  testResult$: Observable<TestResultModel | undefined>;
  template: FormNode;
  defectTpl: FormNode;
  defectsData$: Observable<Defects | undefined>;

  constructor(private testRecordsService: TestRecordsService) {
    this.testResult$ = this.testRecordsService.testResult$;
    this.template = PsvAnnual;
    this.defectTpl = DefectTpl;
    this.defectsData$ = this.testRecordsService.defectData$;
  }
}
