import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormControlStatus,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { InputSpinnerComponent } from '@components/input-spinner/input-spinner.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { SuffixDirective } from '@directives/suffix/suffix.directive';
import { TextInputComponent } from '@forms/components/text-input/text-input.component';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormatVehicleTypePipe } from '@pipes/format-vehicle-type/format-vehicle-type.pipe';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormControl,
	FormNodeEditTypes,
	FormNodeTypes,
	FormNodeViewTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, Subject, combineLatest, filter, firstValueFrom, take } from 'rxjs';

@Component({
	selector: 'app-batch-vehicle-details',
	templateUrl: './batch-vehicle-details.component.html',
	styleUrls: ['./batch-vehicle-details.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		TextInputComponent,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		ToUppercaseDirective,
		SuffixDirective,
		InputSpinnerComponent,
		ButtonGroupComponent,
		ButtonComponent,
		FormatVehicleTypePipe,
	],
})
export class BatchVehicleDetailsComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	globalErrorService = inject(GlobalErrorService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	technicalRecordService = inject(TechnicalRecordService);
	batchTechRecordService = inject(BatchTechnicalRecordService);

	form = this.fb.group({
		vehicles: this.fb.array([]),
		applicationId: new CustomFormControl(
			{ name: 'applicationId', label: 'Application ID', type: FormNodeTypes.CONTROL },
			null,
			[Validators.required]
		),
	});

	vehicleType?: VehicleTypes;
	readonly maxNumberOfVehicles = 40;

	private destroy$ = new Subject<void>();

	constructor() {
		this.technicalRecordService.techRecord$.pipe(take(1)).subscribe((vehicle) => {
			if (!vehicle) return this.back();
		});

		this.batchTechRecordService.vehicleType$.pipe(take(1)).subscribe((vehicleType) => {
			this.vehicleType = vehicleType;
		});
	}

	ngOnInit(): void {
		this.addVehicles(this.maxNumberOfVehicles);
		combineLatest([this.batchTechRecordService.batchVehicles$, this.batchTechRecordService.applicationId$])
			.pipe(take(1))
			.subscribe(([vehicles, applicationId]) => {
				if (this.form && vehicles.length) {
					this.form.patchValue({ vehicles, applicationId });
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get vehicles(): FormArray {
		return this.form.get('vehicles') as FormArray;
	}

	get generateNumber$(): Observable<boolean> {
		return this.batchTechRecordService.generateNumber$;
	}

	get filledVinsInForm() {
		return this.vehicles.value ?? [];
	}

	get width(): typeof FormNodeWidth {
		return FormNodeWidth;
	}

	vehicleForm(index: number): FormGroup {
		return this.fb.group({
			vin: new CustomFormControl(
				{ name: 'vin', type: FormNodeTypes.CONTROL, label: 'VIN', customId: `input-vin${index}` },
				null,
				[CustomValidators.alphanumeric(), Validators.minLength(3), Validators.maxLength(21)],
				this.batchTechRecordService.validateForBatch()
			),
			trailerIdOrVrm: new CustomFormControl({ name: 'trailerIdOrVrm', type: FormNodeTypes.CONTROL }, '', [
				CustomValidators.validateVRMTrailerIdLength('vehicleType'),
				CustomValidators.alphanumeric(),
			]),
			vehicleType: new CustomFormControl(
				{
					name: 'change-vehicle-type-select',
					label: 'Vehicle type',
					type: FormNodeTypes.CONTROL,
					viewType: FormNodeViewTypes.HIDDEN,
					editType: FormNodeEditTypes.HIDDEN,
				},
				this.vehicleType
			),
			createdTimestamp: [''],
			systemNumber: [''],
		});
	}

	validate(group: AbstractControl): void {
		group.get('vin')?.updateValueAndValidity();
	}

	getVinControl(group: AbstractControl): CustomFormControl | null {
		return group.get('vin') as CustomFormControl | null;
	}

	addVehicles(n: number): void {
		for (let i = 0; i < n; i++) {
			this.vehicles.push(this.vehicleForm(i));
		}
	}

	showErrors(): void {
		const errors: GlobalError[] = [];
		DynamicFormService.validate(this.form, errors, false);
		this.globalErrorService.setErrors(errors);
	}

	back(): void {
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	async handleSubmit(): Promise<void> {
		const valid = await this.isFormValid();
		if (!valid) return;

		this.globalErrorService.setErrors([]);
		this.batchTechRecordService.setApplicationId(this.form.get('applicationId')?.value);
		this.batchTechRecordService.upsertVehicleBatch(this.cleanEmptyValues(this.vehicles.value));
		this.back();
	}

	private cleanEmptyValues(
		input: { vin: string; trailerIdOrVrm?: string }[]
	): { vin: string; trailerIdOrVrm?: string }[] {
		return input.filter((formInput) => !!formInput.vin);
	}

	public checkDuplicateVins(input: { vin: string }[]) {
		const vinArray = input.map((item) => item.vin);
		const duplicates: { vin: string; anchor: number }[] = [];
		vinArray.forEach((item, index) => {
			if (!!item && vinArray.indexOf(item) !== index) {
				duplicates.push({ vin: item, anchor: index });
			}
		});
		return duplicates;
	}

	async isFormValid(): Promise<boolean> {
		this.globalErrorService.clearErrors();
		this.form.markAllAsTouched();

		const errors: GlobalError[] = [];

		DynamicFormService.validate(this.form, errors, true);
		if (errors?.length) {
			this.globalErrorService.setErrors(errors);
		}
		if (this.cleanEmptyValues(this.vehicles.value).length === 0) {
			this.globalErrorService.addError({ error: 'At least 1 vehicle must be created or updated in a batch' });
			return false;
		}
		await firstValueFrom(this.formStatus);
		const duplicates = this.checkDuplicateVins(this.vehicles.value);
		if (duplicates.length > 0) {
			duplicates.forEach((element) => {
				this.globalErrorService.addError({
					error: `Remove duplicate VIN - ${element.vin}`,
					anchorLink: `input-vin${element.anchor.toString()}`,
				});
			});
			return false;
		}
		return this.form.valid;
	}

	get formStatus(): Observable<FormControlStatus> {
		return this.form.statusChanges.pipe(filter((status) => status !== 'PENDING'));
	}
}
