import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
	AbstractControl,
	ControlContainer,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { EUVehicleCategory as HGVCategories } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryHgv.enum.js';
import { EUVehicleCategory as PSVCategories } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
import { FuelPropulsionSystem } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { EmissionStandard } from '@models/test-types/emissions.enum';
import {
	HgvPsvVehicleConfiguration,
	TrlVehicleConfiguration,
	VehicleConfiguration,
} from '@models/vehicle-configuration.enum';
import { FuelTypes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { techRecord } from '@store/technical-records';
import { ReplaySubject } from 'rxjs';

type VehicleSectionForm = Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>;

@Component({
	selector: 'app-vehicle-section-edit',
	templateUrl: './vehicle-section-edit.component.html',
	styleUrls: ['./vehicle-section-edit.component.scss'],
})
export class VehicleSectionEditComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly VehicleTypes = VehicleTypes;
	fb = inject(FormBuilder);
	store = inject(Store);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	techRecord = this.store.selectSignal(techRecord);

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group<VehicleSectionForm>(
		{
			// base properties that belong to all vehicle types
			techRecord_euVehicleCategory: this.fb.control<string | null>(null),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
				this.commonValidators.pastYear('Year of manufacture must be the current or a past year'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>({ value: null, disabled: true }),
			techRecord_regnDate: this.fb.control<string | null>(null),
			techRecord_statusCode: this.fb.control<string | null>(null),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [this.updateFunctionCode]),
			techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: null, disabled: true }),
			// vehicle type specific properties
			...this.controlsBasedOffVehicleType,
		},
		{ validators: [] }
	);

	ExemptOrNotOptions = [
		{ value: true, label: 'Exempt' },
		{ value: false, label: 'Not exempt' },
	];

	euroStandardOptions = [
		{ label: '0.10 g/kWh Euro III PM', value: '0.10 g/kWh Euro 3 PM' },
		...getOptionsFromEnum(EmissionStandard),
	];

	fuelPropulsionSystemOptions = [...getOptionsFromEnum(FuelTypes)];

	YesNoOptions = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	];

	ngOnInit(): void {
		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control);
			}
		}

		if (this.techRecord()) {
			this.form.patchValue(this.techRecord() as any);
		}
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const key of Object.keys(this.form.controls)) {
				parent.removeControl(key);
			}
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	// Potential to have a getter for each vehicle type as some vehicle types
	// have different fields to others, this would allow for a more dynamic form
	// could have an overall getter that sets the form with controls that belong
	// to all vehicle types and then a getter for each vehicle type that adds the
	// specific controls that only belong to that vehicle type?
	get hgvFields(): Partial<Record<keyof TechRecordType<'hgv'>, FormControl>> {
		return {
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_drawbarCouplingFitted: this.fb.control<boolean | null>(null),
			techRecord_emissionsLimit: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Emission limit (m-1) (plate value) must be less than or equal to 99'),
				this.commonValidators.pattern(/^\d*(\.\d{0,5})?$/, 'Emission limit (m-1) (plate value) Max 5 decimal places'),
			]),
			techRecord_euroStandard: this.fb.control<string | null>(null),
			techRecord_fuelPropulsionSystem: this.fb.control<FuelPropulsionSystem | null>(null),
			techRecord_offRoad: this.fb.control<boolean | null>(null),
			techRecord_roadFriendly: this.fb.control<boolean | null>(null),
			techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
			techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
			techRecord_vehicleClass_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Vehicle class is required'),
			]),
		};
	}

	get psvFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_emissionsLimit: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Emission limit (m-1) (plate value) must be less than or equal to 99'),
				this.commonValidators.pattern(/^\d*(\.\d{0,5})?$/, 'Emission limit (m-1) (plate value) Max 5 decimal places'),
			]),
			techRecord_fuelPropulsionSystem: this.fb.control<FuelPropulsionSystem | null>(null),
			techRecord_vehicleClass_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Vehicle class is required'),
			]),
			techRecord_seatsUpperDeck: this.fb.control<number | null>(null, [
				this.commonValidators.required('Upper deck is required'),
			]),
			techRecord_seatsLowerDeck: this.fb.control<number | null>(null, [
				this.commonValidators.required('Lower deck is required'),
			]),
			techRecord_standingCapacity: this.fb.control<number | null>(null, [
				this.commonValidators.required('Standing capacity is required'),
			]),
			techRecord_vehicleSize: this.fb.control<string | null>(null, [
				this.commonValidators.required('Vehicle size is required'),
			]),
			techRecord_numberOfSeatbelts: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Number of seatbelts must be less than or equal to 99'),
			]),
			techRecord_seatbeltInstallationApprovalDate: this.fb.control<string | null>(null, [
				this.commonValidators.pastDate('Seatbelt installation approval date / type approved must be in the past'),
			]),
		};
	}

	get trlFields(): Partial<Record<keyof TechRecordType<'trl'>, FormControl>> {
		return {
			techRecord_vehicleClass_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Vehicle class is required'),
			]),
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_roadFriendly: this.fb.control<boolean | null>(null),
			techRecord_firstUseDate: this.fb.control<string | null>(null),
			techRecord_suspensionType: this.fb.control<string | null>(null),
			techRecord_couplingType: this.fb.control<string | null>(null),
			techRecord_maxLoadOnCoupling: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max load on coupling (optional) must be less than or equal to 99999'),
			]),
			techRecord_frameDescription: this.fb.control<string | null>(null),
		};
	}

	get lgvAndCarFields(): Partial<Record<keyof TechRecordType<'lgv' | 'car'>, FormControl>> {
		return {
			techRecord_vehicleSubclass: this.fb.control<string | null>(null),
		};
	}

	// get motorcycleFields(): Partial<Record<keyof TechRecordType<'motorcycle'>, FormControl>> {
	get motorcycleFields(): Partial<Record<string, FormControl>> {
		return {
			techRecord_numberOfWheelsDriven: this.fb.control<number | null>(null),
		};
	}

	isInvalid(formControlName: string) {
		const control = this.form.get(formControlName);
		return control?.invalid && control?.touched;
	}

	updateFunctionCode(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control?.parent) {
				const vehicleFunctionCode = control.parent.get('techRecord_functionCode');
				const functionCodes: Record<string, string> = {
					rigid: 'R',
					articulated: 'A',
					'semi-trailer': 'A',
				};

				if (vehicleFunctionCode && control.dirty) {
					vehicleFunctionCode.setValue(functionCodes[control.value]);
					control.markAsPristine();
				}
			}
			return null;
		};
	}

	get EUCategoryOptions() {
		switch (this.techRecord()?.techRecord_vehicleType.toLowerCase()) {
			case VehicleTypes.HGV:
				return getOptionsFromEnum(HGVCategories);
			case VehicleTypes.PSV:
				return getOptionsFromEnum(PSVCategories);
			case VehicleTypes.TRL:
			case VehicleTypes.SMALL_TRL:
			case VehicleTypes.LGV:
			case VehicleTypes.CAR:
			case VehicleTypes.MOTORCYCLE:
				return null;
			default:
				return getOptionsFromEnum(HGVCategories);
		}
	}

	get vehicleClassDescriptionOptions() {
		switch (this.techRecord()?.techRecord_vehicleType.toLowerCase()) {
			case VehicleTypes.HGV:
				return [{ label: 'heavy goods vehicle', value: 'heavy goods vehicle' }];
			case VehicleTypes.PSV:
				return [
					{
						label: 'small psv (ie: less than or equal to 22 passengers)',
						value: 'small psv (ie: less than or equal to 22 seats)',
					},
					{
						label: 'large psv(ie: greater than or equal to 23 passengers)',
						value: 'large psv(ie: greater than 23 seats)',
					},
				];
			case VehicleTypes.TRL:
			case VehicleTypes.SMALL_TRL:
			case VehicleTypes.LGV:
			case VehicleTypes.CAR:
			case VehicleTypes.MOTORCYCLE:
				return null;
			default:
				return null;
		}
	}

	get vehicleConfigurationOptions() {
		switch (this.techRecord()?.techRecord_vehicleType.toLowerCase()) {
			case VehicleTypes.HGV:
			case VehicleTypes.PSV:
				return [...getOptionsFromEnum(HgvPsvVehicleConfiguration)];
			case VehicleTypes.TRL:
			case VehicleTypes.SMALL_TRL:
				return [...getOptionsFromEnum(TrlVehicleConfiguration)];
			default:
				return [...getOptionsFromEnum(VehicleConfiguration)];
		}
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord()?.techRecord_vehicleType.toLowerCase()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			case VehicleTypes.PSV:
				return this.psvFields;
			case VehicleTypes.TRL:
			case VehicleTypes.SMALL_TRL:
				return this.trlFields;
			case VehicleTypes.LGV:
			case VehicleTypes.CAR:
				return this.lgvAndCarFields;
			case VehicleTypes.MOTORCYCLE:
				return this.motorcycleFields;
			default:
				return {};
		}
	}

	addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control);
		}
	}
}
