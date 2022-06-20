import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FormNode } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestType } from '@models/test-type.model';
import { TestCodes } from '@models/testCodes.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { map, Observable, withLatestFrom, take, firstValueFrom, mergeMap, combineLatest } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  @ViewChild(DynamicFormGroupComponent) dynamicForm?: DynamicFormGroupComponent;

  test: Observable<TestType | undefined>;
  // template: FormNode = <FormNode>{};
  data$: Observable<any>;
  edit$ = this.routerService.routeEditable$;

  constructor(private routerService: RouterService, private testService: TestRecordsService, private actions$: Actions) {
    this.test = testService.selectedTestInTestResult$;
    this.data$ = this.testService.testResult$;
  }

  get testSections$() {
    return this.test.pipe(
      withLatestFrom(this.testService.testResult$),
      map(([test, testResult]) => {
        if (testResult) {
          const { vehicleType } = testResult;
          const tpl = masterTpl[vehicleType as VehicleTypes];
          const sections = test && test.testCode && tpl.hasOwnProperty(test.testCode) ? tpl[test.testCode as TestCodes] : tpl['default'];
          return Object.keys(sections as { [key: string]: any });
        }
        return [];
      })
    );
  }

  get selectedSection$() {
    return this.routerService.getRouteParam$('testSection');
  }

  get template$() {
    return combineLatest([
      this.routerService.getQueryParam$('section'),
      this.testService.testResult$,
      this.testService.selectedTestInTestResult$
    ]).pipe(
      map(([param, testResult, test]) => {
        const tpl = masterTpl[testResult?.vehicleType as VehicleTypes];
        const sections = test && test.testCode ? tpl[test.testCode as TestCodes] : tpl['default'];
        return sections![param ? param : 'default'];
      })
    );
  }

  async handleSave() {
    const { testResultId, testTypeId } = await firstValueFrom(this.routerService.routeNestedParams$);
    const testSection = await firstValueFrom(this.routerService.getQueryParam$('section'));
    if (this.dynamicForm && testSection) {
      const { form } = this.dynamicForm;
      this.testService.updateTestResultState({ testResultId, testTypeId, section: testSection, value: form.value });
    }
  }
}
