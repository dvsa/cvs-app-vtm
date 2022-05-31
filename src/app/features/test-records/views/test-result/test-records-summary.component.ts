import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { PsvAnnual } from '@forms/templates/test-records/section-templates/psv-annual.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';
import { FormNode } from 'src/app/forms/services/dynamic-form.types';

@Component({
  selector: 'app-test-record-summary',
  templateUrl: './test-records-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordSummaryComponent {
  testResult$: Observable<TestResultModel | undefined>;
  defectTpl: FormNode;
  defectsData$: Observable<Defects | undefined>;

  constructor(private testRecordsService: TestRecordsService) {
    this.testResult$ = this.testRecordsService.testResult$;
    this.defectTpl = DefectTpl;
    this.defectsData$ = this.testRecordsService.defectData$;
  }

  get vehicleTypes() {
    return VehicleTypes;
  }

  get masterTpl() {
    return masterTpl;
  }
}
