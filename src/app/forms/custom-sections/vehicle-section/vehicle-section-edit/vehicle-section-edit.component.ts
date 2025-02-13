import { updateVehicleConfiguration } from '@/src/app/store/technical-records';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
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
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { FuelPropulsionSystem } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { CouplingTypeOptions } from '@models/coupling-type-enum';
import {
	ALL_EU_VEHICLE_CATEGORY_OPTIONS,
	ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	ALL_VEHICLE_CONFIGURATION_OPTIONS,
	EMISSION_STANDARD_OPTIONS,
	EXEMPT_OR_NOT_OPTIONS,
	FRAME_DESCRIPTION_OPTIONS,
	FUEL_PROPULSION_SYSTEM_OPTIONS,
	HGV_EU_VEHICLE_CATEGORY_OPTIONS,
	HGV_PSV_VEHICLE_CONFIGURATION_OPTIONS,
	HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	MONTHS,
	PSV_EU_VEHICLE_CATEGORY_OPTIONS,
	PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS,
	SUSPENSION_TYRE_OPTIONS,
	TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	TRL_VEHICLE_CONFIGURATION_OPTIONS,
	VEHICLE_SIZE_OPTIONS,
	VEHICLE_SUBCLASS_OPTIONS,
	YES_NO_OPTIONS,
} from '@models/options.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { V3TechRecordModel, VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject, takeUntil } from 'rxjs';

type VehicleSectionForm = Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>;

@Component({
	selector: 'app-vehicle-section-edit',
	templateUrl: './vehicle-section-edit.component.html',
	styleUrls: ['./vehicle-section-edit.component.scss'],
})
export class VehicleSectionEditComponent implements OnInit, OnDestroy {
	readonly CouplingTypeOptions = CouplingTypeOptions;
	readonly FormNodeWidth = FormNodeWidth;
	readonly TagType = TagType;
	readonly TagTypeLabels = TagTypeLabels;
	readonly VehicleTypes = VehicleTypes;
	readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	readonly EXEMPT_OR_NOT_OPTIONS = EXEMPT_OR_NOT_OPTIONS;
	readonly FUEL_PROPULSION_SYSTEM_OPTIONS = FUEL_PROPULSION_SYSTEM_OPTIONS;
	readonly MONTHS = MONTHS;
	readonly SUSPENSION_TYRE_OPTIONS = SUSPENSION_TYRE_OPTIONS;
	readonly EMISSION_STANDARD_OPTIONS = EMISSION_STANDARD_OPTIONS;
	readonly VEHICLE_SUBCLASS_OPTIONS = VEHICLE_SUBCLASS_OPTIONS;
	readonly VEHICLE_SIZE_OPTIONS = VEHICLE_SIZE_OPTIONS;
	readonly FRAME_DESCRIPTION_OPTIONS = FRAME_DESCRIPTION_OPTIONS;

	fb = inject(FormBuilder);
	store = inject(Store);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group<VehicleSectionForm>({
		// base properties that belong to all vehicle types
		techRecord_euVehicleCategory: this.fb.control<string | null>(null),
		techRecord_manufactureYear: this.fb.control<number | null>(null, [
			this.commonValidators.max(9999, 'Year of manufacture must be less than or equal to 9999'),
			this.commonValidators.min(1000, 'Year of manufacture must be greater than or equal to 1000'),
			this.commonValidators.xYearsAfterCurrent(
				1,
				`Year of manufacture must be equal to or before ${new Date().getFullYear() + 1}`
			),
		]),
		techRecord_statusCode: this.fb.control<string | null>(null),
		techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: null, disabled: true }),
	});

	ngOnInit(): void {
		this.addControlsBasedOffVehicleType();

		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control, { emitEvent: false });
			}
		}

		this.handleUpdateVehicleConfiguration();
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const key of Object.keys(this.form.controls)) {
				parent.removeControl(key, { emitEvent: false });
			}
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get hgvFields(): Partial<Record<keyof TechRecordType<'hgv'>, FormControl>> {
		return {
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_drawbarCouplingFitted: this.fb.control<boolean | null>(null),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
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
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>({ value: null, disabled: true }),
		};
	}

	get psvFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
			techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
			techRecord_euroStandard: this.fb.control<string | null>(null),
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_emissionsLimit: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Emission limit (m-1) (plate value) must be less than or equal to 99'),
				this.commonValidators.pattern(/^\d*(\.\d{0,5})?$/, 'Emission limit (m-1) (plate value) Max 5 decimal places'),
			]),
			techRecord_fuelPropulsionSystem: this.fb.control<FuelPropulsionSystem | null>(null),
			techRecord_vehicleClass_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Vehicle class is required'),
			]),
			techRecord_seatsUpperDeck: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Upper deck must be less than or equal to 99'),
				this.handlePsvPassengersChange(),
			]),
			techRecord_seatsLowerDeck: this.fb.control<number | null>(null, [
				this.commonValidators.max(999, 'Lower deck must be less than or equal to 999'),
				this.handlePsvPassengersChange(),
			]),
			techRecord_standingCapacity: this.fb.control<number | null>(null, [
				this.commonValidators.max(999, 'Standing capacity must be less than or equal to 999'),
				this.handlePsvPassengersChange(),
			]),
			techRecord_vehicleSize: this.fb.control<string | null>(null),
			techRecord_numberOfSeatbelts: this.fb.control<string | null>(null, [
				this.commonValidators.max(99, 'Number of seat belts must be less than or equal to 99'),
			]),
			techRecord_seatbeltInstallationApprovalDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Seatbelt installation approval date / type approved'),
				this.commonValidators.pastDate('Seatbelt installation approval date / type approved must be in the past'),
			]),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>({ value: null, disabled: true }),
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
			techRecord_firstUseDate: this.fb.control<string | null>(null, [this.commonValidators.date('Date of first use')]),
			techRecord_suspensionType: this.fb.control<string | null>(null),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_couplingType: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1, 'Coupling type (optional) must be less than or equal to 1 characters'),
			]),
			techRecord_maxLoadOnCoupling: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Max load on coupling (optional) must be less than or equal to 99999'),
			]),
			techRecord_frameDescription: this.fb.control<string | null>(null),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>({ value: null, disabled: true }),
			techRecord_manufactureMonth: this.fb.control<string | null>(null),
		};
	}

	get smallTrlFields(): Partial<Record<any, FormControl>> {
		return {
			techRecord_vehicleSubclass: this.fb.control<string[] | null>([]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null),
			techRecord_manufactureMonth: this.fb.control<string | null>(null),
			techRecord_vehicleClass_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Vehicle class is required'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Number of axles must be less than or equal to 99'),
			]),
		};
	}

	get lgvAndCarFields(): Partial<Record<keyof TechRecordType<'lgv' | 'car'>, FormControl>> {
		return {
			// default subclass to undefined as null is not allowed and an emtpy array creates a complete record instead of skeleton
			techRecord_vehicleSubclass: this.fb.control<string[] | undefined>({ value: undefined, disabled: false }),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Number of axles must be less than or equal to 99'),
			]),
		};
	}

	// currently typed as string due to wrong typing of motorcycle, as it has a skeleton car in its place
	// get motorcycleFields(): Partial<Record<keyof TechRecordType<'motorcycle'>, FormControl>> {
	get motorcycleFields(): Partial<Record<string, FormControl>> {
		return {
			techRecord_numberOfWheelsDriven: this.fb.control<number | null>(null, [
				this.commonValidators.max(9999, 'Number of wheels driven must be less than or equal to 9999'),
			]),
			techRecord_vehicleClass_description: this.fb.control<string | null>(null, [
				this.commonValidators.required('Vehicle class is required'),
			]),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(VehicleConfiguration.OTHER, [
				this.commonValidators.required('Vehicle configuration is required'),
			]),
			techRecord_regnDate: this.fb.control<string | null>(null, [
				this.commonValidators.date('Date of first registration'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Number of axles must be less than or equal to 99'),
			]),
		};
	}

	handlePsvPassengersChange(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control.dirty) {
				const seatsUpper: number = control.parent?.get('techRecord_seatsUpperDeck')?.getRawValue();
				const seatsLower: number = control.parent?.get('techRecord_seatsLowerDeck')?.getRawValue();
				const standingCapacity: number = control.parent?.get('techRecord_standingCapacity')?.getRawValue();
				const totalPassengers = seatsUpper + seatsLower + standingCapacity;
				this.setPassengerValue(totalPassengers <= 22, control);
				control.markAsPristine();
			}

			return null;
		};
	}

	handleUpdateVehicleConfiguration() {
		const control = this.form.controls.techRecord_vehicleConfiguration;
		control?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((vehicleConfiguration) => {
			const techRecord = this.techRecord();
			if (vehicleConfiguration && vehicleConfiguration !== techRecord.techRecord_vehicleConfiguration) {
				this.store.dispatch(updateVehicleConfiguration({ vehicleConfiguration }));
				control.markAsPristine();
			}
		});
	}

	setPassengerValue(smallPsv: boolean, control: AbstractControl) {
		const classControl = control.parent?.get('techRecord_vehicleClass_description');
		const sizeControl = control.parent?.get('techRecord_vehicleSize');
		if (smallPsv) {
			sizeControl?.setValue(VehicleSizes.SMALL, { emitEvent: false });
			classControl?.setValue(VehicleClassDescription.SmallPsvIeLessThanOrEqualTo22Seats, { emitEvent: false });
		} else {
			sizeControl?.setValue(VehicleSizes.LARGE, { emitEvent: false });
			classControl?.setValue(VehicleClassDescription.LargePsvIeGreaterThan23Seats, { emitEvent: false });
		}
	}

	get EUCategoryOptions() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return HGV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.PSV:
				return PSV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.SMALL_TRL:
				return SMALL_TRL_EU_VEHICLE_CATEGORY_OPTIONS;
			default:
				return ALL_EU_VEHICLE_CATEGORY_OPTIONS;
		}
	}

	get vehicleClassDescriptionOptions() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
			case VehicleTypes.PSV:
				return PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
			case VehicleTypes.TRL:
				return TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
			case VehicleTypes.LGV:
			case VehicleTypes.CAR:
				return null;
			case VehicleTypes.SMALL_TRL:
			case VehicleTypes.MOTORCYCLE:
				return ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
			default:
				return null;
		}
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

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			case VehicleTypes.PSV:
				return this.psvFields;
			case VehicleTypes.TRL:
				return this.trlFields;
			case VehicleTypes.SMALL_TRL:
				return this.smallTrlFields;
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
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	get shouldShowPlatesHgv(): boolean {
		return this.getVehicleType() === VehicleTypes.HGV;
	}

	get shouldShowPlatesTrl(): boolean {
		return this.getVehicleType() === VehicleTypes.TRL;
	}

	get shouldShowSubclass(): boolean {
		return (
			this.getVehicleType() === VehicleTypes.SMALL_TRL ||
			this.getVehicleType() === VehicleTypes.LGV ||
			this.getVehicleType() === VehicleTypes.CAR
		);
	}

	get shouldShowClass(): boolean {
		return (
			this.getVehicleType() === VehicleTypes.TRL ||
			this.getVehicleType() === VehicleTypes.SMALL_TRL ||
			this.getVehicleType() === VehicleTypes.HGV ||
			this.getVehicleType() === VehicleTypes.MOTORCYCLE
		);
	}

	get vehicleClassHint() {
		return this.getVehicleType() === VehicleTypes.PSV
			? 'The Vehicle Class is calculated automatically based on the number of seats and standing capacity. Only change the Class if you need to'
			: '';
	}
}
