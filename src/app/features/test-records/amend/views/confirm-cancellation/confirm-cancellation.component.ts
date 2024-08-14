import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { selectedTestResultState, updateTestResultSuccess } from '@store/test-records';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
	selector: 'app-confirm-cancellation',
	templateUrl: './confirm-cancellation.component.html',
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
		private store: Store,
		private testRecordsService: TestRecordsService,
		private globalErrorService: GlobalErrorService,
		private location: Location
	) {
		this.actions$.pipe(ofType(updateTestResultSuccess), takeUntil(this.destroy$)).subscribe(() => {
			void this.router.navigate(['../../../../..'], { relativeTo: this.route });
		});
	}

	ngOnDestroy(): void {
		this.errorService.clearErrors();
		this.destroy$.next();
		this.destroy$.complete();
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		this.location.back();
	}

	get testResult$(): Observable<TestResultModel | undefined> {
		return this.store.pipe(select(selectedTestResultState));
	}

	get testNumber$(): Observable<string | undefined> {
		return this.store.pipe(
			select(selectRouteNestedParams),
			map((params) => params['testNumber'])
		);
	}

	handleSubmit() {
		if (!this.form.valid) return;

		const reason: string = this.form.get('reason')?.value;

		this.testRecordsService.cleanTestResult();

		this.testRecordsService.cancelTest(reason);
	}
}
