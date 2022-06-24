import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestCodes } from '@models/testCodes.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

@Component({
  selector: 'app-test-sections',
  templateUrl: './test-sections.component.html'
})
export class TestSectionsComponent {
  @ViewChild(DynamicFormGroupComponent) dynamicForm?: DynamicFormGroupComponent;

  data$: Observable<any>;
  edit$ = this.routerService.routeEditable$;

  constructor(private testService: TestRecordsService, private routerService: RouterService, private router: Router) {
    this.data$ = this.testService.testResult$;
  }

  get template$() {
    return combineLatest([
      this.routerService.getRouteParam$('testSection'),
      this.testService.testResult$,
      this.testService.selectedTestInTestResult$
    ]).pipe(
      map(([param, testResult, test]) => {
        const tpl = masterTpl[testResult?.vehicleType as VehicleTypes];
        const sections = test?.testCode && tpl.hasOwnProperty(test.testCode) ? tpl[test.testCode as TestCodes] : tpl['default'];
        return sections![param ?? 'default'];
      })
    );
  }

  async handleSave() {
    const { testResultId, testTypeId, testSection } = await firstValueFrom(this.routerService.routeNestedParams$);
    if (this.dynamicForm && testSection) {
      const { form } = this.dynamicForm;
      this.testService.updateTestResultState({ testResultId, testTypeId, section: testSection, value: form.getCleanValue(form) });
    }
  }
}
