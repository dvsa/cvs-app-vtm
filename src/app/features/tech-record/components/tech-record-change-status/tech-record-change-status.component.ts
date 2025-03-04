import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import {
	archiveTechRecord,
	archiveTechRecordSuccess,
	promoteTechRecord,
	promoteTechRecordSuccess,
} from '@store/technical-records';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-tech-record-change-status',
	templateUrl: './tech-record-change-status.component.html',
})
export class TechRecordChangeStatusComponent implements OnInit, OnDestroy {
	techRecord: TechRecordType<'get'> | undefined;

	form: CustomFormGroup;

	isPromotion = false;

	destroy$ = new Subject<void>();

	constructor(
		private actions$: Actions,
		private errorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<State>,
		private technicalRecordService: TechnicalRecordService
	) {
		this.form = new CustomFormGroup(
			{ name: 'reasonForPromotion', type: FormNodeTypes.GROUP },
			{
				reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [
					Validators.required,
				]),
			}
		);
	}

	ngOnInit(): void {
		this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((record) => {
			this.techRecord = record as TechRecordType<'get'>;
		});

		this.actions$
			.pipe(ofType(promoteTechRecordSuccess, archiveTechRecordSuccess), takeUntil(this.destroy$))
			.subscribe(({ vehicleTechRecord }) => {
				void this.router.navigate([
					`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`,
				]);

				this.technicalRecordService.clearEditingTechRecord();
			});

		this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.isPromotion = params.get('to') === 'current';
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get label(): string {
		return `Reason for ${this.isPromotion ? 'promotion' : 'archiving'}`;
	}

	get buttonLabel(): string {
		return this.isPromotion ? 'Promote' : 'Archive';
	}

	navigateBack(relativePath = '..'): void {
		void this.router.navigate([relativePath], { relativeTo: this.route });
	}

	handleSubmit(form: { reason: string }): void {
		this.form.markAllAsTouched();

		if (!this.techRecord) {
			return;
		}

		if (this.form.valid) {
			this.errorService.clearErrors();
		} else {
			this.errorService.setErrors([
				{
					error: `Reason for ${this.isPromotion ? 'promotion' : 'archiving'} is required`,
					anchorLink: 'reasonForAmend',
				},
			]);
		}

		if (!this.form.valid || !form.reason) {
			return;
		}

		if (this.isPromotion) {
			this.store.dispatch(
				promoteTechRecord({
					systemNumber: this.techRecord.systemNumber,
					createdTimestamp: this.techRecord.createdTimestamp,
					reasonForPromoting: this.form.value.reason,
				})
			);
		} else {
			this.store.dispatch(
				archiveTechRecord({
					systemNumber: this.techRecord.systemNumber,
					createdTimestamp: this.techRecord.createdTimestamp,
					reasonForArchiving: this.form.value.reason,
				})
			);
		}
	}
}
