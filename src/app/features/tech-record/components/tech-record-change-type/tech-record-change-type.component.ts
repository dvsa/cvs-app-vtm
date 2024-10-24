import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType as TechRecordTypeByVehicle } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { MultiOptions } from '@models/options.model';
import { CustomFormControl, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';

import { StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { changeVehicleType } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/technical-record-service.reducer';
import { take } from 'rxjs';

@Component({
	selector: 'app-change-vehicle-type',
	templateUrl: './tech-record-change-type.component.html',
	styleUrls: ['./tech-record-change-type.component.scss'],
})
export class ChangeVehicleTypeComponent implements OnInit {
	techRecord?: V3TechRecordModel;
	makeAndModel?: string;

	form: FormGroup = new FormGroup({
		selectVehicleType: new CustomFormControl(
			{ name: 'change-vehicle-type-select', label: 'Select a new vehicle type', type: FormNodeTypes.CONTROL },
			'',
			[Validators.required]
		),
	});

	constructor(
		private globalErrorService: GlobalErrorService,
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<TechnicalRecordServiceState>,
		private technicalRecordService: TechnicalRecordService
	) {}

	ngOnInit(): void {
		this.globalErrorService.clearErrors();
		this.technicalRecordService.techRecord$.pipe(take(1)).subscribe((techRecord) => {
			if (!techRecord) {
				this.navigateBack();
			} else {
				this.techRecord = techRecord;
			}
		});

		if (this.techRecord) {
			this.makeAndModel = this.technicalRecordService.getMakeAndModel(this.techRecord);
		}
	}

	get vehicleType(): VehicleTypes | undefined {
		return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
	}

	get vehicleTypeOptions(): MultiOptions {
		return getOptionsFromEnumAcronym(VehicleTypes).filter((type) => type.value !== this.vehicleType);
	}

	get currentVrm() {
		return this.techRecord?.techRecord_vehicleType !== 'trl' ? this.techRecord?.primaryVrm : undefined;
	}

	navigateBack() {
		this.globalErrorService.clearErrors();
		void this.router.navigate(['..'], { relativeTo: this.route });
	}

	handleSubmit(selectedVehicleType: VehicleTypes): void {
		if (!selectedVehicleType) {
			return this.globalErrorService.setErrors([
				{ error: 'You must provide a new vehicle type', anchorLink: 'selectedVehicleType' },
			]);
		}

		if (
			selectedVehicleType === VehicleTypes.TRL &&
			((this.techRecord as TechRecordTypeByVehicle<'trl'>)?.techRecord_euVehicleCategory === EUVehicleCategory.O1 ||
				(this.techRecord as TechRecordTypeByVehicle<'trl'>)?.techRecord_euVehicleCategory === EUVehicleCategory.O2)
		) {
			return this.globalErrorService.setErrors([
				{
					error: "You cannot change vehicle type to TRL when EU vehicle category is set to 'O1' or 'O2'",
					anchorLink: 'selectedVehicleType',
				},
			]);
		}

		this.store.dispatch(changeVehicleType({ techRecord_vehicleType: selectedVehicleType }));

		this.technicalRecordService.clearReasonForCreation();

		this.globalErrorService.clearErrors();

		const routeSuffix =
			this.techRecord?.techRecord_statusCode !== StatusCodes.PROVISIONAL
				? 'amend-reason'
				: 'notifiable-alteration-needed';

		void this.router.navigate([`../${routeSuffix}`], { relativeTo: this.route });
	}
}
