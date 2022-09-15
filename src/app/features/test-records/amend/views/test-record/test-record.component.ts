import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode } from '@forms/services/dynamic-form.types';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Actions, ofType } from '@ngrx/effects';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { updateTestResultSuccess } from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { filter, firstValueFrom, Observable, of, skipWhile, Subject, switchMap, take, takeUntil } from 'rxjs';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit, OnDestroy {
  @ViewChild(BaseTestRecordComponent) private baseTestRecordComponent?: BaseTestRecordComponent;

  private destroy$ = new Subject<void>();

  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
      switchMap(editingTestResult => (editingTestResult ? of(editingTestResult) : this.testRecordsService.testResult$))
    );
    this.sectionTemplates$ = this.testRecordsService.sectionTemplates$;
    this.watchForUpdateSuccess();
    this.testResult$
      .pipe(
        skipWhile(testResult => !testResult),
        take(1)
      )
      .subscribe(testResult => {
        this.testRecordsService.editingTestResult(testResult!);
      });

    this.routerService
      .getQueryParam$('testType')
      .pipe(
        take(1),
        filter(testType => !!testType)
      )
      .subscribe(testTypeId => {
        this.testRecordsService.testTypeChange(testTypeId!);
      });
  }

  ngOnDestroy(): void {
    this.testRecordsService.cancelEditingTestResult();
    this.errorService.clearErrors();

    this.destroy$.next();
    this.destroy$.complete();
  }

  public get Roles() {
    return Roles;
  }

  backToTestRecord(): void {
    this.router.navigate(['..'], { relativeTo: this.route.parent });
  }

  /**
   * Merge all section form values into one testResult and trigger action to update testResult.
   * @returns void
   */
  async handleSave(): Promise<void> {
    const errors: GlobalError[] = [];
    const forms = [];

    if (this.baseTestRecordComponent) {
      const { sections, defects } = this.baseTestRecordComponent;
      if (sections) {
        sections.forEach(section => {
          forms.push(section.form);
        });
      }

      if (defects) {
        forms.push(defects.form);
      }
    }

    // if all forms are not marcked as dirty, return
    if (!this.isAnyFormDirty(forms) && (await firstValueFrom(this.testRecordsService.isSameTestTypeId$))) {
      return;
    }

    forms.forEach(form => {
      DynamicFormService.updateValidity(form, errors);
    });

    if (errors.length > 0) {
      this.errorService.setErrors(errors);
    }

    if (this.isAnyFormInvalid(forms)) {
      return;
    }

    const testResult = await firstValueFrom(this.testResult$);

    this.testRecordsService.updateTestResult(cloneDeep(testResult));
  }

  watchForUpdateSuccess() {
    this.actions$.pipe(ofType(updateTestResultSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.backToTestRecord();
    });
  }

  get isTestTypeGroupEditable$(): Observable<boolean> {
    return this.testRecordsService.isTestTypeGroupEditable$;
  }

  handleNewTestResult(testResult: any) {
    this.testRecordsService.updateEditingTestResult(testResult);
  }

  isAnyFormDirty(forms: Array<FormGroup>) {
    return forms.some(form => form.dirty);
  }

  isAnyFormInvalid(forms: Array<FormGroup>) {
    return forms.some(form => form.invalid);
  }
}
