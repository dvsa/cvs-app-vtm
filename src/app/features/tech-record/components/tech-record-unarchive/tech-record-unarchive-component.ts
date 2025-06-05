import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { RadioGroupComponent } from '@forms/components/radio-group/radio-group.component';
import { TextAreaComponent } from '@forms/components/text-area/text-area.component';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
	CustomFormControl,
	CustomFormGroup,
	FormNodeOption,
	FormNodeTypes,
} from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { unarchiveTechRecord, unarchiveTechRecordSuccess } from '@store/technical-records';
import { Subject, takeUntil } from 'rxjs';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';

@Component({
	selector: 'app-tech-record-unarchive',
	templateUrl: './tech-record-unarchive.component.html',
	imports: [
		TechRecordTitleComponent,
		FormsModule,
		ReactiveFormsModule,
		RadioGroupComponent,
		TextAreaComponent,
		ButtonComponent,
	],
})
export class TechRecordUnarchiveComponent implements OnInit, OnDestroy {
	actions$ = inject(Actions);
	errorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject(Store<State>);
	technicalRecordService = inject(TechnicalRecordService);

	techRecord: TechRecordType<'get'> | undefined;
	statusCodes: Array<FormNodeOption<string>> = [
		{ label: 'Provisional', value: StatusCodes.PROVISIONAL },
		{ label: 'Current', value: StatusCodes.CURRENT },
	];
	form = new CustomFormGroup(
		{ name: 'unarchivalForm', type: FormNodeTypes.GROUP },
		{
			newRecordStatus: new CustomFormControl(
				{
					name: 'newRecordStatus',
					customErrorMessage: 'New Record Status is required',
					type: FormNodeTypes.CONTROL,
				},
				undefined,
				[Validators.required]
			),
			reason: new CustomFormControl(
				{
					name: 'reason',
					type: FormNodeTypes.CONTROL,
					customErrorMessage: 'Unarchival Reason is required',
				},
				undefined,
				[Validators.required]
			),
		}
	);

	destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((record) => {
			this.techRecord = record as TechRecordType<'get'>;
		});

		this.actions$
			.pipe(ofType(unarchiveTechRecordSuccess), takeUntil(this.destroy$))
			.subscribe(({ vehicleTechRecord }) => {
				void this.router.navigate([
					`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`,
				]);

				this.technicalRecordService.clearEditingTechRecord();
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	navigateBack(relativePath = '..'): void {
		void this.router.navigate([relativePath], { relativeTo: this.route });
	}

	handleSubmit(form: { reason: string; newRecordStatus: string }): void {
		this.form.markAllAsTouched();

		if (!this.techRecord) {
			return;
		}

		if (this.form.valid) {
			this.errorService.clearErrors();
		}

		if (this.form.invalid) {
			this.validateControls();
		}

		if (!this.form.valid || !form.reason || !form.newRecordStatus) {
			return;
		}

		this.store.dispatch(
			unarchiveTechRecord({
				systemNumber: this.techRecord.systemNumber,
				createdTimestamp: this.techRecord.createdTimestamp,
				reasonForUnarchiving: this.form.value.reason,
				status: this.form.value.newRecordStatus,
			})
		);
	}

	private validateControls() {
		const reasonControl = this.form.controls['reason'];
		const newRecordStatusControl = this.form.controls['newRecordStatus'];

		const errors = [];
		if (!reasonControl.valid) {
			errors.push({
				error: 'Unarchival Reason is required',
				anchorLink: 'reason',
			});
		}

		if (!newRecordStatusControl.valid) {
			errors.push({
				error: 'New Record Status is required',
				anchorLink: 'newRecordStatus',
			});
		}

		this.errorService.setErrors(errors);
	}
}
