import { Component } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { PsvAnnual } from '@forms/templates/psv/psv-annual.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-amended-test-record',
  templateUrl: './amended-test-record.component.html'
})
export class AmendedTestRecordComponent {
  testResult$: Observable<TestResultModel | undefined>;
  template: FormNode;
  defectTpl: FormNode;
  defectData$: Observable<Defects | undefined>;

  constructor(private testRecordsService: TestRecordsService) {
    this.testResult$ = this.testRecordsService.amendedTestResult$;
    this.template = PsvAnnual;
    this.defectTpl = DefectTpl;
    this.defectData$ = this.testRecordsService.amendedDefectData$;
  }
}
