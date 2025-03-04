import { Component, OnDestroy, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { techRecord, updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';
import cloneDeep from 'lodash.clonedeep';
import { Subject, skipWhile, take, takeUntil, withLatestFrom } from 'rxjs';

@Component({
	selector: 'app-tech-record-change-visibility',
	templateUrl: './tech-record-change-visibility.component.html',
	styleUrls: ['./tech-record-change-visibility.component.scss'],
})
export class TechRecordChangeVisibilityComponent implements OnDestroy {
	private store = inject(Store<State>);
	private actions$ = inject(Actions);
	private errorService = inject(GlobalErrorService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private technicalRecordService = inject(TechnicalRecordService);
	private routerService = inject(RouterService);

	techRecord?: V3TechRecordModel = this.store.selectSignal(techRecord)();
	form: CustomFormGroup;
	private destroy$ = new Subject<void>();

	constructor() {
		this.form = new CustomFormGroup(
			{ name: 'reasonForChangingVisibility', type: FormNodeTypes.GROUP },
			{
				reason: new CustomFormControl(
					{
						name: 'reason',
						type: FormNodeTypes.CONTROL,
						customErrorMessage: 'Why are you making this change?',
					},
					undefined,
					[Validators.required]
				),
			}
		);
		this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
			void this.router.navigate([
				`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`,
			]);
		});
	}

	get title(): string {
		return `${this.techRecord?.techRecord_hiddenInVta ? 'Show' : 'Hide'} record in VTA`;
	}

	get buttonLabel(): string {
		return `${this.techRecord?.techRecord_hiddenInVta ? 'Show' : 'Hide'} record`;
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	goBack(): void {
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit(form: { reason: string }): void {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.errorService.clearErrors();
		} else {
			this.errorService.setErrors([
				{
					error: 'Why are you making this change?',
					anchorLink: 'reason',
				},
			]);
		}

		if (!this.form.valid || !form.reason) {
			return;
		}

		const updatedTechRecord: TechRecordType<'put'> = {
			...cloneDeep(this.techRecord as TechRecordType<'put'>),
			techRecord_reasonForCreation: form.reason,
			techRecord_hiddenInVta: !this.techRecord?.techRecord_hiddenInVta,
		};

		this.technicalRecordService.updateEditingTechRecord(updatedTechRecord);

		this.technicalRecordService.techRecord$
			.pipe(
				takeUntil(this.destroy$),
				skipWhile(
					(technicalRecord) => technicalRecord?.techRecord_hiddenInVta !== this.techRecord?.techRecord_hiddenInVta
				),
				withLatestFrom(
					this.routerService.getRouteNestedParam$('systemNumber'),
					this.routerService.getRouteNestedParam$('createdTimestamp')
				),
				take(1)
			)
			.subscribe(([, systemNumber, createdTimestamp]) => {
				if (systemNumber && createdTimestamp) {
					this.store.dispatch(updateTechRecord({ systemNumber, createdTimestamp }));
				}
			});
	}
}
