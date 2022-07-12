import { Component, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-amended-test-record',
  templateUrl: './amended-test-record.component.html'
})
export class AmendedTestRecordComponent implements OnInit {
  defectTpl: FormNode = DefectTpl;
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defects$: Observable<Defects | undefined> = of(undefined);

  constructor(private testRecordsService: TestRecordsService, private routerService: RouterService) {}

  ngOnInit() {
    this.testResult$ = this.testRecordsService.amendedTestResult$;
    this.defectTpl = DefectTpl;
    this.defects$ = this.testRecordsService.amendedDefectData$;
  }
}
