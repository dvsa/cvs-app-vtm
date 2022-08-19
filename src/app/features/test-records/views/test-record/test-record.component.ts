import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { Defect } from '@models/defects/defect.model';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { defects, DefectsState, fetchDefects } from '@store/defects';
import { updateTestResultSuccess } from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { firstValueFrom, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';

@Component({
  selector: 'app-test-records',
  templateUrl: './test-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestRecordComponent implements OnInit, OnDestroy {
  @ViewChild(BaseTestRecordComponent) private baseTestRecordComponent?: BaseTestRecordComponent;

  private destroy$ = new Subject<void>();

  isEditing$: Observable<boolean> = of(false);
  testResult$: Observable<TestResultModel | undefined> = of(undefined);
  sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

  constructor(
    private actions$: Actions,
    private defectsStore: Store<DefectsState>,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit(): Promise<void> {
    this.isEditing$ = this.routerService.routeEditable$;
    this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
      switchMap(editingTestResult => (editingTestResult ? of(editingTestResult) : this.testRecordsService.testResult$))
    );
    this.defectsStore.dispatch(fetchDefects());
    this.sectionTemplates$ = this.testRecordsService.sectionTemplates$;
    this.watchForUpdateSuccess();
    this.testRecordsService.editingTestResult((await firstValueFrom(this.testResult$)) as TestResultModel);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get Roles() {
    return Roles;
  }

  get defects$(): Observable<Defect[]> {
    return this.defectsStore.select(defects);
  }

  handleEdit(): void {
    this.router.navigate([], { queryParams: { edit: 'true' }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  handleCancel(): void {
    this.testRecordsService.cancelEditingTestResult();
    this.errorService.clearErrors();

    this.router.navigate([], { queryParams: { edit: null }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  /**
   * Merge all section form values into one testResult and trigger action to update testResult.
   * @returns void
   */
  async handleSave(): Promise<void> {
    const errors: GlobalError[] = [];
    const forms = [];

    if (this.baseTestRecordComponent) {
      const { sections, defects, requiredProps } = this.baseTestRecordComponent;
      if (sections) {
        sections.forEach(section => {
          forms.push(section.form);
        });
      }

      if (defects) {
        forms.push(defects.form);
      }

      if (requiredProps) {
        forms.push(requiredProps.form);
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
