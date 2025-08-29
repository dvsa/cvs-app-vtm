import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import {
	ALL_EU_VEHICLE_CATEGORY_OPTIONS,
	ALL_VEHICLE_CONFIGURATION_OPTIONS,
	CAR_EU_VEHICLE_CATEGORY_OPTIONS,
	HGV_EU_VEHICLE_CATEGORY_OPTIONS,
	HGV_PSV_VEHICLE_CONFIGURATION_OPTIONS,
	LGV_EU_VEHICLE_CATEGORY_OPTIONS,
	MultiOptions,
	PSV_EU_VEHICLE_CATEGORY_OPTIONS,
	SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS,
	TRL_EU_VEHICLE_CATEGORY_OPTIONS,
	TRL_VEHICLE_CONFIGURATION_OPTIONS,
} from '@models/options.model';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReplaySubject, of } from 'rxjs';

type VehicleSectionForm = Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>;

@Component({
	selector: 'app-general-vehicle-details',
	templateUrl: './general-vehicle-details.component.html',
	styleUrls: ['./general-vehicle-details.component.scss'],
	imports: [
		GovukFormGroupDateComponent,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		AsyncPipe,
		GovukFormGroupSelectComponent,
		GovukFormGroupRadioComponent,
	],
})
export class GeneralVehicleDetailsComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
	bodyMakes$ = of<MultiOptions | undefined>([]);

	optionsService = inject(MultiOptionsService);

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	form = this.fb.group<VehicleSectionForm>({
		// base properties that belong to all vehicle types
		// techRecord_manufactureYear: this.fb.control<number | null>(null, [
		//   this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
		//   this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
		//   this.commonValidators.xYearsAfterCurrent(
		//     1,
		//     `Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
		//   ),
		// ]),
		// techRecord_statusCode: this.fb.control<string | null>(null),
	});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

		// Attach all form controls to parent
		this.init(this.form);

		this.loadBodyMakes();
	}

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			// case VehicleTypes.PSV:
			//   return this.psvFields;
			// case VehicleTypes.TRL:
			//   return this.trlFields;
			// case VehicleTypes.SMALL_TRL:
			//   return this.smallTrlFields;
			// case VehicleTypes.LGV:
			//   return this.lgvFields;
			// case VehicleTypes.CAR:
			//   return this.carFields;
			// case VehicleTypes.MOTORCYCLE:
			//   return this.motorcycleFields;
			default:
				return {};
		}
	}

	get hgvFields(): Partial<Record<keyof TechRecordType<'hgv'>, FormControl>> {
		return {
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
				this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
				this.commonValidators.xYearsAfterCurrent(
					1,
					`Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
				),
			]),
			techRecord_brakes_dtpNumber: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(6, 'DTp number must be less than or equal to 6 characters'),
			]),
			techRecord_make: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(50, 'Body make must be less than or equal to 50 characters'),
				// this.bodyMakeRequiredWithDangerousGoods(),
			]),
			techRecord_model: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(30, 'Body model must be less than or equal to 30 characters'),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_bodyType_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Body type is required'),
			]),
			techRecord_functionCode: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1, 'Function code must be less than or equal to 1 characters'),
			]),
			techRecord_conversionRefNo: this.fb.control<string | null>(null, [
				this.commonValidators.pattern(
					'^[A-Z0-9 ]{0,10}$',
					'Conversion reference number max length 10 uppercase letters or numbers'
				),
			]),
			techRecord_euVehicleCategory: this.fb.control<string | null>(null),
			techRecord_noOfAxles: this.fb.control<number | null>(null),
		};
	}

	get vehicleConfigurationOptions() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
			case VehicleTypes.PSV:
				return HGV_PSV_VEHICLE_CONFIGURATION_OPTIONS;
			case VehicleTypes.TRL:
			case VehicleTypes.SMALL_TRL:
				return TRL_VEHICLE_CONFIGURATION_OPTIONS;
			default:
				return ALL_VEHICLE_CONFIGURATION_OPTIONS;
		}
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	get bodyTypes(): MultiOptions {
		let vehicleType: string = this.techRecord().techRecord_vehicleType;

		if (this.techRecord().techRecord_vehicleType === 'hgv') {
			vehicleType = `${this.techRecord().techRecord_vehicleConfiguration}Hgv`;
		}
		const optionsMap = vehicleBodyTypeCodeMap.get(vehicleType) ?? [];
		const values = [...optionsMap.values()];
		return getOptionsFromEnum(values.sort());
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get EUCategoryOptions() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return HGV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.PSV:
				return PSV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.TRL:
				return TRL_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.SMALL_TRL:
				return SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.LGV:
				return LGV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.CAR:
				return CAR_EU_VEHICLE_CATEGORY_OPTIONS;
			default:
				return ALL_EU_VEHICLE_CATEGORY_OPTIONS;
		}
	}

	loadBodyMakes() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.HGV:
				this.bodyMakes$ = this.optionsService.getOptions(ReferenceDataResourceType.HgvMake);
				break;
			case VehicleTypes.PSV:
				this.bodyMakes$ = this.optionsService.getOptions(ReferenceDataResourceType.PsvMake);
				break;
			case VehicleTypes.TRL:
				this.bodyMakes$ = this.optionsService.getOptions(ReferenceDataResourceType.TrlMake);
				break;
		}
	}
}
