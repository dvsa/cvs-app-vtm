import { Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TextAreaComponent } from '@forms/components/text-area/text-area.component';
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
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';

@Component({
	selector: 'app-tech-record-change-status',
	templateUrl: './tech-record-change-status.component.html',
	imports: [TechRecordTitleComponent, FormsModule, ReactiveFormsModule, TextAreaComponent, ButtonComponent],
})
export class TechRecordChangeStatusComponent implements OnInit, OnDestroy {
	actions$ = inject(Actions);
	errorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store<State>);
	technicalRecordService = inject(TechnicalRecordService);
	titleService = inject(Title);

	readonly techRecord = toSignal(this.technicalRecordService.techRecord$) as Signal<TechRecordType<'get'> | undefined>;

	form = new CustomFormGroup(
		{ name: 'reasonForPromotion', type: FormNodeTypes.GROUP },
		{
			reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]),
		}
	);

	isPromotion = false;

	destroy$ = new Subject<void>();

	ngOnInit(): void {
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
			this.titleService.setTitle(
				`${this.isPromotion ? 'Promote' : 'Archive'} technical record - Vehicle Testing Management`
			);
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	getTitleText(): string {
		return this.isPromotion ? 'Promote technical record' : 'Archive technical record';
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

		const techRecord = this.techRecord();
		if (!techRecord) {
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
					systemNumber: techRecord.systemNumber,
					createdTimestamp: techRecord.createdTimestamp,
					reasonForPromoting: this.form.value.reason,
				})
			);
		} else {
			this.store.dispatch(
				archiveTechRecord({
					systemNumber: techRecord.systemNumber,
					createdTimestamp: techRecord.createdTimestamp,
					reasonForArchiving: this.form.value.reason,
				})
			);
		}
	}
}
