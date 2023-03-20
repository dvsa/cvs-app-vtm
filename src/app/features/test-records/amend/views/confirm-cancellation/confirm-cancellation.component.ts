import { Component, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormGroup, FormNodeTypes, CustomFormControl } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { cancelTestResult, cancelTestResultSuccess, selectedTestResultState } from '@store/test-records';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-confirm-cancellation',
  templateUrl: './confirm-cancellation.component.html'
})
export class ConfirmCancellationComponent implements OnDestroy {
  form = new CustomFormGroup(
    { name: 'cancellation-reason', type: FormNodeTypes.GROUP },
    { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]) }
  );

  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.actions$
      .pipe(ofType(cancelTestResultSuccess), takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate(['../../../../..'], { relativeTo: this.route }));
  }

  ngOnDestroy(): void {
    this.errorService.clearErrors();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get testResult$(): Observable<TestResultModel | undefined> {
    return this.store.pipe(select(selectedTestResultState));
  }

  get testNumber$(): Observable<string | undefined> {
    return this.store.pipe(
      select(selectRouteNestedParams),
      map(params => params['testNumber'])
    );
  }

  handleSubmit() {
    if (!this.form.valid) return;

    const reason: string = this.form.get('reason')?.value;

    this.store.dispatch(cancelTestResult({ reason }));
  }
}
