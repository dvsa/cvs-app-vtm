import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { Actions, ofType } from '@ngrx/effects';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { updateTestResultSuccess } from '@store/test-records';
import merge from 'lodash.merge';
import { Observable, of, Subject, takeUntil, map } from 'rxjs';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';
import { Roles } from '@models/roles.enum'
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestResultDefects } from '@models/test-results/test-result-defects.model';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit, OnDestroy {
  @ViewChild(BaseTestRecordComponent) private set baseTestRecordComponent(component: BaseTestRecordComponent) {
    component?.sectionForms.forEach(form => {
      this.sectionForms.push(form);
    });
  }

  private destroy$ = new Subject<void>();

  isEditing$: Observable<boolean> = of(false);
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  defects$: Observable<TestResultDefects | undefined> = of(undefined);
  sectionForms: Array<CustomFormGroup | CustomFormArray> = [];

  constructor(
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService,
    private actions$: Actions
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.isEditing$ = this.routerService.routeEditable$;
    this.testResult$ = this.testRecordsService.testResult$;
    this.defects$ = this.testRecordsService.defectData$;
    this.watchForUpdateSuccess();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get Roles() {
    return Roles;
  }

  handleEdit(): void {
    this.router.navigate([], { queryParams: { edit: 'true' }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  handleCancel(): void {
    this.router.navigate([], { queryParams: { edit: null }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  /**
   * Merge all section form values into one testResult and trigger action to update testResult.
   * @returns void
   */
  handleSave(): void {
    this.sectionForms.forEach(form => {
      const errors: GlobalError[] = [];
      DynamicFormService.updateValidity(form, errors);
      if (errors.length > 0) {
        this.errorService.patchErrors(errors);
      }
    });

    if (this.sectionForms.some(form => form.invalid)) {
      return;
    }

    const updatedTestResult = {};

    this.sectionForms.forEach(form => merge(updatedTestResult, form.getCleanValue(form)));

    this.testRecordsService.updateTestResult(updatedTestResult);
  }

  watchForUpdateSuccess() {
    this.actions$.pipe(ofType(updateTestResultSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.handleCancel();
    });
  }

  get isTestTypeGroupEditable$(): Observable<boolean> {
    return this.testResult$.pipe(
      map(testResult => {
        if (!testResult) {
          return false;
        }

        const vehicleType = testResult.vehicleType;
        const testTypeId = testResult.testTypes[0].testTypeId;
        const testTypeGroup = TestRecordsService.getTestTypeGroup(testTypeId);
        const vehicleTpl = vehicleType && masterTpl[vehicleType];

        return !!testTypeGroup && !!vehicleTpl && vehicleTpl.hasOwnProperty(testTypeGroup);
      })
    );
  }
}
