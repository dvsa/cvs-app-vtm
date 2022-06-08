import { Component, OnInit } from '@angular/core';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';

@Component({
  selector: 'app-amended-test-record',
  templateUrl: './amended-test-record.component.html'
})
export class AmendedTestRecordComponent extends BaseTestRecordComponent implements OnInit {
  constructor(private testRecordsService: TestRecordsService, routerService: RouterService) {
    super(routerService);
  }

  ngOnInit() {
    this.testResult$ = this.testRecordsService.amendedTestResult$;
    this.defectTpl = DefectTpl;
    this.defectsData$ = this.testRecordsService.amendedDefectData$;
  }
}
