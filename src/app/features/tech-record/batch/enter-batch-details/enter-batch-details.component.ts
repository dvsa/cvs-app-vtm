import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/radio/radio.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions } from '@/src/app/models/options.model';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { setBatchDetails } from '@/src/app/store/technical-records/batch-create.actions';
import { selectBatchDetails } from '@/src/app/store/technical-records/batch-create.selectors';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReplaySubject, combineLatest, takeUntil } from 'rxjs';

@Component({
	selector: 'app-enter-batch-details',
	templateUrl: './enter-batch-details.component.html',
	styleUrls: ['./enter-batch-details.component.scss'],
	imports: [
		ButtonComponent,
		ButtonGroupComponent,
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		RadioComponent,
	],
})
export class EnterBatchDetailsComponent implements OnInit {
	readonly fb = inject(FormBuilder);
	readonly store = inject(Store);
	readonly router = inject(Router);
	readonly activatedRoute = inject(ActivatedRoute);
	readonly validators = inject(CommonValidatorsService);
	readonly errorService = inject(GlobalErrorService);

	readonly savedBatchDetails = this.store.selectSignal(selectBatchDetails);

	readonly form = this.fb.group({
		vehicleStatus: this.fb.control<StatusCodes | null>(null, [this.validators.required('Vehicle status')]),
		vehicleType: this.fb.control<VehicleTypes | null>(null, [this.validators.required('Vehicle type')]),
		trlFormType: this.fb.control<TrailerFormType | null>(null, [
			this.validators.applyWhen(
				() => this.isTrlSelected(),
				this.validators.required(() => ({ error: 'Select a trailer form type', anchorLink: 'trlFormType-tes1-radio' }))
			),
		]),
	});

	readonly StatusCodes = StatusCodes;
	readonly VehicleTypes = VehicleTypes;
	readonly TrailerFormType = TrailerFormType;
	readonly vehicleStatusOptions: MultiOptions = [
		{ label: 'Current', value: StatusCodes.CURRENT },
		{ label: 'Provisional', value: StatusCodes.PROVISIONAL },
	];
	readonly trailerFormTypeOptions: MultiOptions = [
		{ label: 'TES1', value: TrailerFormType.TES1 },
		{ label: 'TES2', value: TrailerFormType.TES2 },
	];
	readonly trailerFormTypeHintText = 'Trailer form type must be TES1 if vehicle status is current';
	readonly trailerFormTypeHint = signal(this.trailerFormTypeHintText);
	readonly destroy = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.handleFormChange();
		this.handlePopulateForm();
	}

	isTrlSelected(): boolean {
		return this.form.get('vehicleType')?.value === VehicleTypes.TRL;
	}

	handleFormChange(): void {
		combineLatest({
			vehicleType: this.form.controls.vehicleType.valueChanges,
			vehicleStatus: this.form.controls.vehicleStatus.valueChanges,
		})
			.pipe(takeUntil(this.destroy))
			.subscribe((form) => {
				if (form.vehicleType === VehicleTypes.TRL && form.vehicleStatus === StatusCodes.CURRENT) {
					this.form.controls.trlFormType.patchValue(TrailerFormType.TES1, { emitEvent: false });
					this.form.controls.trlFormType.disable({ emitEvent: false });
					this.trailerFormTypeHint.set(this.trailerFormTypeHintText);
				} else {
					this.form.controls.trlFormType.patchValue(null, { emitEvent: false });
					this.form.controls.trlFormType.enable({ emitEvent: false });
				}

				if (form.vehicleStatus === StatusCodes.PROVISIONAL) {
					this.trailerFormTypeHint.set('');
				}
			});
	}

	handlePopulateForm(): void {
		const savedBatchDetails = this.savedBatchDetails();
		this.form.patchValue(savedBatchDetails);

		// Once a vehicle type is selected it cannot be changed by going back to this page
		if (savedBatchDetails.vehicleType) {
			this.form.controls.vehicleType.disable({ emitEvent: false });
		}
	}

	handleContinue(): void {
		this.form.markAllAsTouched();

		const errors = this.errorService.extractGlobalErrors(this.form);
		if (errors.length > 0) {
			this.errorService.setErrors(errors);
		}

		if (errors.length === 0) {
			const value = this.form.getRawValue();
			this.store.dispatch(
				setBatchDetails({
					vehicleType: value.vehicleType as VehicleTypes,
					vehicleStatus: value.vehicleStatus as StatusCodes,
					trlFormType: value.trlFormType as TrailerFormType,
				})
			);
			this.router.navigate([RootRoutes.BATCH, BatchRoutes.ENTER_BATCH_SIZE]);
		}
	}

	handleCancel(): void {
		this.router.navigate([RootRoutes.BATCH, BatchRoutes.CANCEL_BATCH]);
	}
}
