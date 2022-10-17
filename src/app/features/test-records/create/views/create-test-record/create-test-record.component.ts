import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Actions, ofType } from '@ngrx/effects';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { createTestResultSuccess } from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { filter, firstValueFrom, Observable, of, Subject, take, takeUntil, tap } from 'rxjs';
import { BaseTestRecordComponent } from '../../../components/base-test-record/base-test-record.component';

@Component({
  selector: 'app-create-test-record',
  templateUrl: './create-test-record.component.html'
})
export class CreateTestRecordComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(BaseTestRecordComponent) private baseTestRecordComponent?: BaseTestRecordComponent;

  private destroy$ = new Subject<void>();

  testResult$: Observable<TestResultModel | undefined> = of(undefined);

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService,
    private cdr: ChangeDetectorRef,
    private resultOfTestService: ResultOfTestService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.testResult$ = this.testRecordsService.editingTestResult$.pipe(tap(editingTestResult => !editingTestResult && this.backToTechRecord()));

    this.routerService
      .getQueryParam$('testType')
      .pipe(
        take(1),
        tap(testType => !testType && this.backToTechRecord()),
        filter(tt => !!tt)
      )
      .subscribe(testTypeId => {
        this.testRecordsService.contingencyTestTypeSelected(testTypeId!);
      });

    this.watchForCreateSuccess();
  }

  ngOnDestroy(): void {
    this.errorService.clearErrors();

    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  backToTechRecord(): void {
    this.router.navigate(['../../..'], { relativeTo: this.route.parent });
  }

  /**
   * Merge all section form values into one testResult and trigger action to update testResult.
   * @returns void
   */
  async handleSave(): Promise<void> {
    const errors: GlobalError[] = [];
    const forms = [];

    if (this.baseTestRecordComponent?.sections) {
      this.baseTestRecordComponent.sections.forEach(section => forms.push(section.form));
    }

    if (this.baseTestRecordComponent?.defects) {
      forms.push(this.baseTestRecordComponent.defects.form);
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

    this.testRecordsService.createTestResult(cloneDeep(testResult));
  }

  watchForCreateSuccess() {
    this.actions$.pipe(ofType(createTestResultSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.backToTechRecord();
    });
  }

  handleNewTestResult(testResult: any) {
    this.testRecordsService.updateEditingTestResult(testResult);
  }

  isAnyFormInvalid(forms: Array<FormGroup>) {
    return forms.some(form => form.invalid);
  }

  handleAbandon() {
    this.resultOfTestService.toggleAbandoned();
  }
}
