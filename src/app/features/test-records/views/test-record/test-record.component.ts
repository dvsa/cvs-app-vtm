import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { FormNode } from '@forms/services/dynamic-form.types';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { Defects } from '@models/defects';
import { TestResultModel } from '@models/test-result.model';
import { Actions, ofType } from '@ngrx/effects';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { TestTypesService } from '@services/test-types/test-types.service';
import { updateTestResultSuccess } from '@store/test-records';
import cloneDeep from 'lodash.clonedeep';
import { firstValueFrom, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';
import { Roles } from '@models/roles.enum';

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
  defects$: Observable<Defects | undefined> = of(undefined);
  sectionTemplates$: Observable<FormNode[] | undefined> = of(undefined);

  constructor(
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private testRecordsService: TestRecordsService,
    private actions$: Actions,
    private testTypeService: TestTypesService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit(): Promise<void> {
    this.isEditing$ = this.routerService.routeEditable$;
    this.testResult$ = this.testRecordsService.editingTestResult$.pipe(
      switchMap(editingTestResult => (editingTestResult ? of(editingTestResult) : this.testRecordsService.testResult$))
    );
    this.defects$ = this.testRecordsService.defectData$;
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

  async handleEdit(): Promise<void> {
    this.router.navigate([], { queryParams: { edit: 'true' }, queryParamsHandling: 'merge', relativeTo: this.route });
  }

  handleCancel(): void {
    this.testRecordsService.cancelEditingTestResult();
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
    if (!forms.some(form => form.dirty)) {
      console.log('Clean');
      return;
    }

    forms.forEach(form => {
      DynamicFormService.updateValidity(form, errors);
    });

    if (errors.length > 0) {
      this.errorService.patchErrors(errors);
    }

    if (forms.some(form => form.invalid)) {
      console.log('Invalid');
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
}
