import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectsComponent } from '@forms/components/defects/defects.component';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { DefectTpl } from '@forms/templates/general/defect.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { firstValueFrom, Observable, of, tap } from 'rxjs';
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

  @ViewChild(DefectsComponent) private set defectsComponent(component: DefectsComponent) {
    component?.data$?.pipe(tap(defects => this.defects = defects || []));
  }

  sectionForms: Array<CustomFormGroup | CustomFormArray> = [];
  defects: Defects = [];

  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defectsData$: Observable<Defects | undefined> = of(undefined);
  isEditing$: Observable<boolean> = of(false);

  constructor(
    private dynamicFormService: DynamicFormService,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService,
  ) {}

  ngOnInit() {
    this.testResult$ = this.testRecordsService.testResult$;
    this.defectsData$ = this.testRecordsService.defectData$;
    this.isEditing$ = this.routerService.routeEditable$;
  }

  handleEdit() {
    this.router.navigate([], { queryParams: { edit: true }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  handleCancel() {
    this.router.navigate([], { queryParams: { edit: false }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  async handleSave() {
    this.sectionForms.concat(this.defects.map(defect => this.dynamicFormService.createForm(DefectTpl, defect)));

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
