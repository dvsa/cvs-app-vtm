import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit {
  @ViewChild(BaseTestRecordComponent) private set baseTestRecordComponent(component: BaseTestRecordComponent) {
    component?.dynamicFormGroupComponents?.forEach(component => this.sectionForms.push(component.form));
  }

  isEditing$: Observable<boolean> = of(false);
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defects$: Observable<Defects | undefined> = of(undefined);

  sectionForms: Array<CustomFormGroup | CustomFormArray> = [];
  defectForms: Array<CustomFormGroup | CustomFormArray> = [];

  constructor(
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.isEditing$ = this.routerService.routeEditable$;
    this.testResult$ = this.testRecordsService.testResult$;
    this.defects$ = this.testRecordsService.defectData$;
  }

  defectFormsChange(forms: Array<CustomFormGroup | CustomFormArray>): void {
    this.defectForms = forms;
  }

  handleEdit(): void {
    this.router.navigate([], { queryParams: { edit: 'true' }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  handleCancel(): void {
    this.router.navigate([], { queryParams: { edit: null }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  async handleSave(): Promise<void> {
    this.sectionForms.concat(this.defectForms.filter(f => f));

    this.sectionForms.forEach(form => {
      const errors = DynamicFormService.updateValidity(form);
      errors.length > 0 && this.errorService.patchErrors(errors);
    });

    if (this.sectionForms.some(form => form.invalid)) {
      return;
    }

    const { testResultId, testTypeId } = await firstValueFrom(this.routerService.routeNestedParams$);

    this.sectionForms.forEach(
      form => this.testRecordsService.updateTestResultState(testResultId, testTypeId, form.meta.name, form.getCleanValue(form))
    );
  }
}
