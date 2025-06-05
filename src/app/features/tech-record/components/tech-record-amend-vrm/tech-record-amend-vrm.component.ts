import { UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, output, viewChildren } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { FieldWarningMessageComponent } from '@forms/components/field-warning-message/field-warning-message.component';
import { TextInputComponent } from '@forms/components/text-input/text-input.component';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { VehicleTypes, VehiclesOtherThan } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/technical-record-service.reducer';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
	selector: 'app-change-amend-vrm',
	templateUrl: './tech-record-amend-vrm.component.html',
	styleUrls: ['./tech-record-amend-vrm.component.scss'],
	imports: [
		FieldWarningMessageComponent,
		NumberPlateComponent,
		FormsModule,
		ReactiveFormsModule,
		TextInputComponent,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		ButtonGroupComponent,
		ButtonComponent,
		UpperCasePipe,
		DefaultNullOrEmpty,
	],
})
export class AmendVrmComponent implements OnDestroy, OnInit {
	actions$ = inject(Actions);
	dfs = inject(DynamicFormService);
	globalErrorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	store = inject<Store<TechnicalRecordServiceState>>(Store<TechnicalRecordServiceState>);

	techRecord?: VehiclesOtherThan<'trl'>;
	makeAndModel?: string;
	isCherishedTransfer = false;
	systemNumber?: string;
	createdTimestamp?: string;
	formValidity = false;
	width: FormNodeWidth = FormNodeWidth.L;

	private technicalRecordService = inject(TechnicalRecordService);

	cherishedTransferForm = new FormGroup({
		currentVrm: new CustomFormControl(
			{
				name: 'current-Vrm',
				label: 'Current VRM',
				type: FormNodeTypes.CONTROL,
			},
			'',
			[
				Validators.required,
				CustomValidators.alphanumeric(),
				CustomValidators.notZNumber,
				Validators.minLength(3),
				Validators.maxLength(9),
			],
			this.technicalRecordService.validateVrmForCherishedTransfer()
		),
		previousVrm: new CustomFormControl({
			name: 'previous-Vrm',
			label: 'Previous VRM',
			type: FormNodeTypes.CONTROL,
			disabled: true,
		}),
		thirdMark: new CustomFormControl(
			{
				name: 'third-Mark',
				label: 'Third Mark',
				type: FormNodeTypes.CONTROL,
			},
			undefined,
			[CustomValidators.alphanumeric(), CustomValidators.notZNumber, Validators.minLength(3), Validators.maxLength(9)]
		),
	});
	correctingAnErrorForm = new FormGroup({
		newVrm: new CustomFormControl(
			{
				name: 'new-Vrm',
				label: 'New VRM',
				type: FormNodeTypes.CONTROL,
			},
			'',
			[
				Validators.required,
				CustomValidators.alphanumeric(),
				CustomValidators.notZNumber,
				Validators.minLength(3),
				Validators.maxLength(9),
			]
		),
	});

	readonly isFormDirty = output<boolean>();
	readonly isFormInvalid = output<boolean>();

	readonly sections = viewChildren(DynamicFormGroupComponent);

	private destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.systemNumber = params['systemNumber'];
			this.createdTimestamp = params['createdTimestamp'];
			this.isCherishedTransfer = params['reason'] === 'cherished-transfer';
		});
		this.technicalRecordService.techRecord$.pipe(take(1), takeUntil(this.destroy$)).subscribe((record) => {
			if (record?.techRecord_statusCode === 'archived' || !record) {
				return this.navigateBack();
			}
			this.techRecord = record as VehiclesOtherThan<'trl'>;
			this.makeAndModel = this.technicalRecordService.getMakeAndModel(record);
		});

		this.actions$.pipe(ofType(amendVrmSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
			void this.router.navigate([
				'/tech-records',
				`${vehicleTechRecord.systemNumber}`,
				`${vehicleTechRecord.createdTimestamp}`,
			]);
		});

		this.cherishedTransferForm.controls['previousVrm'].setValue(this.techRecord?.primaryVrm ?? '');
		this.cherishedTransferForm.controls['previousVrm'].disable();
		this.cherishedTransferForm.controls['thirdMark'].setAsyncValidators(
			this.technicalRecordService.validateVrmDoesNotExist(this.techRecord?.primaryVrm ?? '')
		);
		this.correctingAnErrorForm.controls['newVrm'].setAsyncValidators(
			this.technicalRecordService.validateVrmDoesNotExist(this.techRecord?.primaryVrm ?? '')
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get vehicleType(): VehicleTypes | undefined {
		return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['../../'], { relativeTo: this.route });
	}

	handleFormChange() {
		if (this.isCherishedTransfer) {
			this.cherishedTransferForm.get('currentVrm')?.updateValueAndValidity();
		}
	}

	handleSubmit(): void {
		if (!this.isFormValid()) {
			return;
		}

		this.store.dispatch(
			amendVrm({
				newVrm: this.isCherishedTransfer
					? this.cherishedTransferForm.value.currentVrm
					: this.correctingAnErrorForm.value.newVrm,
				cherishedTransfer: this.isCherishedTransfer,
				thirdMark: this.isCherishedTransfer ? this.cherishedTransferForm.value.thirdMark : undefined,
				systemNumber: (this.techRecord as TechRecordType<'get'>)?.systemNumber,
				createdTimestamp: (this.techRecord as TechRecordType<'get'>)?.createdTimestamp,
			})
		);
	}

	isFormValid(): boolean {
		this.globalErrorService.clearErrors();

		const errors: GlobalError[] = [];

		if (this.isCherishedTransfer) {
			DynamicFormService.validate(this.cherishedTransferForm, errors, false);
		} else {
			DynamicFormService.validate(this.correctingAnErrorForm, errors, false);
		}

		if (errors?.length > 0) {
			this.globalErrorService.setErrors(errors);
			return false;
		}
		return true;
	}

	get showWarning(): boolean {
		if (this.vehicleType) {
			return this.vehicleType === 'psv' || this.vehicleType === 'hgv';
		}
		return false;
	}
}
