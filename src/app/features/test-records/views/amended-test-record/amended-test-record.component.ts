import { Component } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-amended-test-record',
  templateUrl: './amended-test-record.component.html'
})
export class AmendedTestRecordComponent {
  testResult$: Observable<TestResultModel | undefined>;
  defectTpl: FormNode;
  defectData$: Observable<Defects | undefined>;

  constructor(private testRecordsService: TestRecordsService) {
    this.testResult$ = this.testRecordsService.amendedTestResult$;
    this.defectTpl = DefectTpl;
    this.defectData$ = this.testRecordsService.amendedDefectData$;
  }

  get vehicleTypes() {
    return VehicleTypes;
  }

  get masterTpl() {
    return masterTpl;
  }
}
