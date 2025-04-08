import { UpperCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleTypes, VehiclesOtherThan } from '@models/vehicle-tech-record.model';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import {
	CustomFormControl,
	FormNodeOption,
	FormNodeTypes,
	FormNodeWidth,
} from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Subject, take, takeUntil } from 'rxjs';
import { ButtonGroupComponent } from '../../../../components/button-group/button-group.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { NumberPlateComponent } from '../../../../components/number-plate/number-plate.component';
import { RadioGroupComponent } from '../../../../forms/components/radio-group/radio-group.component';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-amend-vrm-reason',
	templateUrl: './tech-record-amend-vrm-reason.component.html',
	styleUrls: ['./tech-record-amend-vrm-reason.component.scss'],
	imports: [
		NumberPlateComponent,
		FormsModule,
		ReactiveFormsModule,
		RadioGroupComponent,
		ButtonGroupComponent,
		ButtonComponent,
		UpperCasePipe,
		DefaultNullOrEmpty,
	],
})
export class AmendVrmReasonComponent implements OnDestroy, OnInit {
	techRecord?: VehiclesOtherThan<'trl'>;
	makeAndModel?: string;

	form = new FormGroup({
		isCherishedTransfer: new CustomFormControl(
			{ name: 'is-cherished-transfer', label: 'Reason for change', type: FormNodeTypes.CONTROL },
			undefined,
			[Validators.required]
		),
	});

	private destroy$ = new Subject<void>();

	constructor(
		public dfs: DynamicFormService,
		private globalErrorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router,
		private technicalRecordService: TechnicalRecordService
	) {}

	ngOnInit(): void {
		this.technicalRecordService.techRecord$.pipe(take(1), takeUntil(this.destroy$)).subscribe((record) => {
			if (record?.techRecord_statusCode === 'archived' || !record) {
				return this.navigateBack();
			}
			this.techRecord = record as VehiclesOtherThan<'trl'>;
			this.makeAndModel = this.technicalRecordService.getMakeAndModel(record);
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get reasons(): Array<FormNodeOption<string>> {
		return [
			{ label: 'Cherished transfer', value: 'cherished-transfer', hint: 'Current VRM will be archived' },
			{ label: 'Correcting an error', value: 'correcting-error', hint: 'Current VRM will not be archived' },
		];
	}

	get width(): FormNodeWidth {
		return FormNodeWidth.L;
	}

	get vehicleType(): VehicleTypes | undefined {
		return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	submit(): void {
		if (!this.isFormValid) {
			return;
		}

		void this.router.navigate([this.form.controls['isCherishedTransfer'].value], { relativeTo: this.route });
	}

	get isFormValid(): boolean {
		const errors: GlobalError[] = [];

		DynamicFormService.validate(this.form, errors);

		this.globalErrorService.setErrors(errors);

		return this.form.valid;
	}
}
