import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';
import { FormNode } from 'src/app/forms/services/dynamic-form.types';
import { PsvAnnual } from '../../../../forms/templates/psv/psv-annual.template';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-records.component.html',
  styleUrls: ['./test-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent {
  testResult$: Observable<TestResultModel | undefined>;
  template: FormNode;
  defectTpl: FormNode;
  defectData$: Observable<Defects | undefined>;

  constructor(private testRecordsService: TestRecordsService) {
    this.testResult$ = this.testRecordsService.testResult$;
    this.template = PsvAnnual;
    this.defectTpl = DefectTpl;
    this.defectData$ = this.testRecordsService.defectData$;
  }
}
