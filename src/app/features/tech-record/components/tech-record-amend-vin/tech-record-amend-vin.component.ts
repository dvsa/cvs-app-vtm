import { UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { ButtonComponent } from '@components/button/button.component';
import { InputSpinnerComponent } from '@components/input-spinner/input-spinner.component';
import { NumberPlateComponent } from '@components/number-plate/number-plate.component';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@directives/app-trim-whitespace/app-trim-whitespace.directive';
import { SuffixDirective } from '@directives/suffix/suffix.directive';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TextInputComponent } from '@forms/components/text-input/text-input.component';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { amendVin, amendVinSuccess } from '@store/technical-records';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';

@Component({
	selector: 'app-change-amend-vin',
	templateUrl: './tech-record-amend-vin.component.html',
	imports: [
		NumberPlateComponent,
		FormsModule,
		ReactiveFormsModule,
		TextInputComponent,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
		SuffixDirective,
		InputSpinnerComponent,
		ButtonGroupComponent,
		ButtonComponent,
		UpperCasePipe,
		DefaultNullOrEmpty,
	],
})
export class AmendVinComponent implements OnDestroy, OnInit {
	actions$ = inject(Actions);
	globalErrorService = inject(GlobalErrorService);
	route = inject(ActivatedRoute);
	router = inject(Router);
	technicalRecordService = inject(TechnicalRecordService);
	routerService = inject(RouterService);
	store = inject<Store<State>>(Store<State>);

	techRecord?: V3TechRecordModel;
	form!: FormGroup;
	private destroy$ = new Subject<void>();

	constructor() {
		this.initForm();
		this.handleAmendVinSuccess();
	}

	ngOnInit(): void {
		this.subscribeToTechRecordUpdates();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get width(): FormNodeWidth {
		return FormNodeWidth.L;
	}

	get vehicleType(): VehicleTypes | undefined {
		return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
	}

	get makeAndModel(): string | undefined {
		return this.techRecord ? this.technicalRecordService.getMakeAndModel(this.techRecord) : undefined;
	}

	get currentVrm(): string | undefined {
		return this.techRecord?.techRecord_vehicleType !== 'trl' ? (this.techRecord?.primaryVrm ?? '') : undefined;
	}

	isFormValid(): boolean {
		const errors: GlobalError[] = [];
		DynamicFormService.validate(this.form, errors);
		this.globalErrorService.setErrors(errors);

		if (this.form.value.vin === this.techRecord?.vin) {
			this.globalErrorService.addError({ error: 'You must provide a new VIN', anchorLink: 'newVin' });
			return false;
		}

		return this.form.valid;
	}

	navigateBack(): void {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit(): void {
		if (this.shouldUpdateTechRecord()) {
			this.updateTechRecord();
		}
	}

	private initForm(): void {
		this.form = new FormGroup({
			vin: new CustomFormControl(
				{
					name: 'vin',
					label: 'VIN',
					type: FormNodeTypes.CONTROL,
				},
				'',
				[
					CustomValidators.alphanumeric(),
					Validators.minLength(3),
					Validators.maxLength(21),
					Validators.required,
					CustomValidators.validateVinCharacters(),
				],
				[this.technicalRecordService.validateVinForUpdate(this.techRecord?.vin)]
			),
		});
	}

	private handleAmendVinSuccess(): void {
		this.actions$.pipe(ofType(amendVinSuccess), takeUntil(this.destroy$)).subscribe(({ vehicleTechRecord }) => {
			void this.router.navigate([
				`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`,
			]);
		});
	}

	private subscribeToTechRecordUpdates(): void {
		this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((record) => {
			if (record?.techRecord_statusCode === 'archived' || !record) {
				this.navigateBack();
			} else {
				this.techRecord = record;
			}
		});
	}

	private shouldUpdateTechRecord(): boolean {
		return this.isFormValid() || (this.form.status === 'PENDING' && this.form.errors === null);
	}

	private updateTechRecord(): void {
		const record = { ...this.techRecord } as TechRecordType<'put'>;
		record.vin = this.form.value.vin;

		this.technicalRecordService.updateEditingTechRecord({
			...record,
			techRecord_reasonForCreation: 'Vin changed',
		});

		this.routerService
			.getRouteNestedParam$('systemNumber')
			.pipe(
				take(1),
				takeUntil(this.destroy$),
				withLatestFrom(this.routerService.getRouteNestedParam$('createdTimestamp'))
			)
			.subscribe(([systemNumber, createdTimestamp]) => {
				if (systemNumber && createdTimestamp) {
					const newVin = this.form.value.vin;
					this.store.dispatch(amendVin({ newVin, systemNumber, createdTimestamp }));
				}
			});
	}
}
