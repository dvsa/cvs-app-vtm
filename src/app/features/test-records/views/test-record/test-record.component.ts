import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
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
  @ViewChild(BaseTestRecordComponent) private set baseTestRecordComponent(c: BaseTestRecordComponent) {
    c?.dynamicFormGroupComponents?.forEach((component) => {
      this.sectionForms.push(component.form);
    });
  }

  sectionForms: Array<CustomFormGroup | CustomFormArray> = [];

  defectTpl: FormNode = DefectTpl;
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defectsData$: Observable<Defects | undefined> = of(undefined);
  edit$: Observable<boolean> = of(false);

  constructor(
    private testRecordsService: TestRecordsService,
    private routerService: RouterService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: GlobalErrorService
  ) {}

  ngOnInit() {
    this.testResult$ = this.testRecordsService.testResult$;
    this.defectsData$ = this.testRecordsService.defectData$;
    this.edit$ = this.routerService.routeEditable$;
  }

  handleEdit() {
    this.router.navigate([], { queryParams: { edit: true }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  handleCancel() {
    this.router.navigate([], { queryParams: { edit: false }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  get sectionFormsInvalid() {
    return [...this.sectionForms].map((f) => f.invalid).some((b) => b);
  }

  async handleSave() {
    this.sectionForms.forEach((f) => {
      const errors = DynamicFormService.updateValidity(f);
      errors.length > 0 && this.errorService.patchErrors(errors);
    });

    if (this.sectionFormsInvalid) {
      return;
    }

    const { testResultId, testTypeId } = await firstValueFrom(this.routerService.routeNestedParams$);

    this.sectionForms.forEach((form) => {
      const testSection = form.meta.name;
      this.testRecordsService.updateTestResultState({ testResultId, testTypeId, section: testSection, value: form.getCleanValue(form) });
    });
  }
}
