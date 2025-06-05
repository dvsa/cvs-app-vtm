import { AsyncPipe, Location } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TextAreaComponent } from '@forms/components/text-area/text-area.component';
import { TestResultModel } from '@models/test-results/test-result.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { selectRouteNestedParams } from '@store/router/router.selectors';
import { selectedTestResultState, updateTestResultSuccess } from '@store/test-records';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { VehicleHeaderComponent } from '../../../components/vehicle-header/vehicle-header.component';

@Component({
	selector: 'app-confirm-cancellation',
	templateUrl: './confirm-cancellation.component.html',
	imports: [FormsModule, ReactiveFormsModule, VehicleHeaderComponent, TextAreaComponent, ButtonComponent, AsyncPipe],
})
export class ConfirmCancellationComponent implements OnDestroy {
	actions$ = inject(Actions);
	errorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store);
	testRecordsService = inject(TestRecordsService);
	globalErrorService = inject(GlobalErrorService);
	location = inject(Location);

	form = new CustomFormGroup(
		{ name: 'cancellation-reason', type: FormNodeTypes.GROUP },
		{
			reason: new CustomFormControl(
				{ name: 'reason', type: FormNodeTypes.CONTROL, customErrorMessage: 'Reason for cancellation is required' },
				undefined,
				[Validators.required]
			),
		}
	);

	private destroy$ = new Subject<void>();

	constructor() {
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
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			const errors = [];
			if (this.form.get('reason')?.invalid) {
				errors.push({
					error: 'Reason for cancellation is required',
					anchorLink: 'reason',
				});
			}

			this.errorService.setErrors(errors);

			return;
		}

		if (this.form.valid) {
			this.errorService.clearErrors();
		}

		const reason: string = this.form.get('reason')?.value;

		this.testRecordsService.cleanTestResult();

		this.testRecordsService.cancelTest(reason);
	}
}
