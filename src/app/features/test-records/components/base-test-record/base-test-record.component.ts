import { Component } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { RouterService } from '@services/router/router.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-base-test-record',
  template: ``
})
export class BaseTestRecordComponent {
  defectTpl: FormNode;
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defectsData$: Observable<Defects | undefined> = of(undefined);
  edit$: Observable<boolean> = of(false);

  constructor(protected readonly routerService: RouterService) {
    this.defectTpl = DefectTpl;
    this.edit$ = this.routerService.routeEditable$;
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  get masterTpl() {
    return masterTpl;
  }
}
