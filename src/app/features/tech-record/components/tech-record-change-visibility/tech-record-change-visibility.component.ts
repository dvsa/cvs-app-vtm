import { GovukFormGroupTextareaComponent } from '@/src/app/forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TextAreaComponent } from '@forms/components/text-area/text-area.component';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { techRecord, updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';
import cloneDeep from 'lodash.clonedeep';
import { Subject, skipWhile, take, takeUntil, withLatestFrom } from 'rxjs';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';

@Component({
	selector: 'app-tech-record-change-visibility',
	templateUrl: './tech-record-change-visibility.component.html',
	styleUrls: ['./tech-record-change-visibility.component.scss'],
	imports: [
		TechRecordTitleComponent,
		FormsModule,
		ReactiveFormsModule,
		TextAreaComponent,
		GovukFormGroupTextareaComponent,
	],
})
export class TechRecordChangeVisibilityComponent implements OnInit, OnDestroy {
	private store = inject(Store<State>);
	private actions$ = inject(Actions);
	private errorService = inject(GlobalErrorService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private technicalRecordService = inject(TechnicalRecordService);
	private routerService = inject(RouterService);
	private fb = inject(FormBuilder);
	private validators = inject(CommonValidatorsService);

	techRecord = this.store.selectSignal(techRecord);

	form = this.fb.group({
		reason: this.fb.control<string | null>(null),
	});

	private destroy$ = new Subject<void>();

	constructor() {
		this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
			void this.router.navigate([
				`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`,
			]);
		});
	}

	get title(): string {
		return `${this.techRecord()?.techRecord_hiddenInVta ? 'Show' : 'Hide'} record in VTA`;
	}

	get buttonLabel(): string {
		return `${this.techRecord()?.techRecord_hiddenInVta ? 'Show' : 'Hide'} record`;
	}

	ngOnInit(): void {
		const status = this.techRecord()?.techRecord_hiddenInVta;
		if (status) {
			this.form.controls.reason.setValidators([
				this.validators.required('Enter a reason for showing the record in VTA'),
				this.validators.maxLength(
					100,
					'Reason for showing the record in VTA must be less than or equal to 100 characters'
				),
			]);
		} else {
			this.form.controls.reason.setValidators([
				this.validators.required('Enter a reason for hiding the record in VTA'),
				this.validators.maxLength(
					100,
					'Reason for hiding the record in VTA must be less than or equal to 100 characters'
				),
			]);
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	goBack(): void {
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit(): void {
		const reason = this.form.controls.reason.value;

		this.form.markAllAsTouched();

		if (this.form.valid) {
			this.errorService.clearErrors();
		}

		if (!this.form.valid || !reason) {
			const errors = this.errorService.extractGlobalErrors(this.form);
			this.errorService.setErrors(errors);

			return;
		}

		const updatedTechRecord: TechRecordType<'put'> = {
			...cloneDeep(this.techRecord() as TechRecordType<'put'>),
			techRecord_reasonForCreation: reason,
			techRecord_hiddenInVta: !this.techRecord()?.techRecord_hiddenInVta,
		};

		this.technicalRecordService.updateEditingTechRecord(updatedTechRecord);

		this.technicalRecordService.techRecord$
			.pipe(
				takeUntil(this.destroy$),
				skipWhile(
					(technicalRecord) => technicalRecord?.techRecord_hiddenInVta !== this.techRecord()?.techRecord_hiddenInVta
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
