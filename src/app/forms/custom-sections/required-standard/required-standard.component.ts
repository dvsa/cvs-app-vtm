import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { RequiredStandardsTpl } from '@forms/templates/general/required-standards.template';
import { INSPECTION_TYPE, TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import { Store, select } from '@ngrx/store';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { getRequiredStandardFromTypeAndRef } from '@store/required-standards/selectors/required-standards.selector';
import { selectRouteParam } from '@store/router/selectors/router.selectors';
import {
  createRequiredStandard, removeRequiredStandard, testResultInEdit, toEditOrNotToEdit, updateRequiredStandard,
} from '@store/test-records';
import {
  Subject, distinctUntilChanged,
  takeUntil, withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'app-required-standard',
  templateUrl: './required-standard.component.html',
  providers: [DefaultNullOrEmpty],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequiredStandardComponent implements OnInit, OnDestroy {
  form!: CustomFormGroup;
  index!: number;
  requiredStandard?: TestResultRequiredStandard;
  onDestroy$ = new Subject();
  isEditing: boolean;
  amendingRs?: boolean;

  private requiredStandardForm?: CustomFormArray;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private resultService: ResultOfTestService,
    private router: Router,
    private dfs: DynamicFormService,
    private errorService: GlobalErrorService,
  ) {
    this.isEditing = this.activatedRoute.snapshot.data['isEditing'];
  }

  ngOnInit(): void {
    const inspectionType = this.store.pipe(select(selectRouteParam('inspectionType')));
    const rsRefCalculation = this.store.pipe(select(selectRouteParam('ref')));
    const requiredStandardIndex = this.store.pipe(select(selectRouteParam('requiredStandardIndex')));

    this.store.pipe(select(this.isEditing ? testResultInEdit : toEditOrNotToEdit)).pipe(
      withLatestFrom(inspectionType, rsRefCalculation, requiredStandardIndex),
      takeUntil(this.onDestroy$),
      distinctUntilChanged((prev, curr) => prev[0]?.testTypes[0]?.testResult === curr[0]?.testTypes[0]?.testResult),
    ).subscribe(([testResult, inspectionTypeValue, rsRefCalculationValue, requiredStandardIndexValue]) => {
      if (!testResult) this.navigateBack();
      this.requiredStandardForm = (this.dfs.createForm(RequiredStandardsTpl, testResult) as CustomFormGroup)
        .get(['testTypes', '0', 'requiredStandards']) as CustomFormArray;
      if (requiredStandardIndexValue) {
        this.amendingRs = true;
        this.index = Number(requiredStandardIndexValue);
        this.form = this.requiredStandardForm.controls[this.index] as CustomFormGroup;
        this.requiredStandard = testResult?.testTypes[0]?.requiredStandards?.at(this.index);
      } else {
        this.amendingRs = false;
        this.store.pipe(
          select(getRequiredStandardFromTypeAndRef(inspectionTypeValue as INSPECTION_TYPE, rsRefCalculationValue ?? '')),
          takeUntil(this.onDestroy$),
        )
          .subscribe((requiredStandard) => {
            if (!requiredStandard) this.navigateBack();
            const rsControl = {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...requiredStandard!,
              prs: false,
              additionalNotes: '',
            };

            this.requiredStandard = rsControl;
            this.requiredStandardForm?.addControl(rsControl);
            // eslint-disable-next-line no-unsafe-optional-chaining
            this.form = this.requiredStandardForm?.controls[this.requiredStandardForm?.length - 1] as CustomFormGroup;

          });
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  navigateBack() {
    this.resultService.updateResultOfTestRequiredStandards();
    void this.router.navigate(this.amendingRs ? ['../../'] : ['../../../'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }

  toggleRsPrsField() {
    if (!this.requiredStandard) {
      return;
    }
    this.requiredStandard.prs = !this.requiredStandard.prs;
    this.requiredStandardForm?.controls[this.requiredStandardForm.length - 1].get('prs')?.patchValue(this.requiredStandard.prs);
  }

  handleSubmit() {
    const errors: GlobalError[] = [];
    DynamicFormService.validate(this.form, errors);

    if (errors.length > 0) {
      this.errorService.setErrors(errors);
    }

    if (this.form.invalid) {
      return;
    }

    if (this.index || this.index === 0) {
      this.store.dispatch(
        updateRequiredStandard({ requiredStandard: this.form.getCleanValue(this.form) as TestResultRequiredStandard, index: this.index }),
      );
    } else {
      this.store.dispatch(createRequiredStandard({ requiredStandard: this.form.getCleanValue(this.form) as TestResultRequiredStandard }));
    }
    this.navigateBack();
  }

  handleRemove() {
    this.store.dispatch(removeRequiredStandard({ index: this.index }));
    this.navigateBack();
  }
}
