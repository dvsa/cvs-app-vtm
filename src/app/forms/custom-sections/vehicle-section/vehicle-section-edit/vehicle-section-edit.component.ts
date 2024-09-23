import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { FuelPropulsionSystem } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { FuelTypes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { techRecord } from '@store/technical-records';
import { ReplaySubject, take } from 'rxjs';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { EmissionStandard } from '@models/test-types/emissions.enum';

type VehicleSectionForm = Partial<Record<keyof TechRecordType<'hgv'>, FormControl>>;

@Component({
	selector: 'app-vehicle-section-edit',
	templateUrl: './vehicle-section-edit.component.html',
	styleUrls: ['./vehicle-section-edit.component.scss'],
})
export class VehicleSectionEditComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;
	fb = inject(FormBuilder);
	store = inject(Store);
	controlContainer = inject(ControlContainer);

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group<VehicleSectionForm>(
		{
			// values from hgv-tech-record template file
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_drawbarCouplingFitted: this.fb.control<boolean | null>(null),
			techRecord_emissionsLimit: this.fb.control<number | null>(null),
			techRecord_euVehicleCategory: this.fb.control<string | null>(null),
			techRecord_euroStandard: this.fb.control<string | null>(null),
			techRecord_fuelPropulsionSystem: this.fb.control<FuelPropulsionSystem | null>(null),
			techRecord_functionCode: this.fb.control<string | null>(null),
			techRecord_manufactureYear: this.fb.control<number | null>(null, [
				this.min(1000, 'Year of manufacture'),
				this.pastYear('Year of manufacture'),
			]),
			techRecord_noOfAxles: this.fb.control<number | null>({ value: null, disabled: true }),
			techRecord_offRoad: this.fb.control<boolean | null>(null),
			techRecord_regnDate: this.fb.control<string | null>(null),
			techRecord_roadFriendly: this.fb.control<boolean | null>(null),
			techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
			techRecord_statusCode: this.fb.control<string | null>(null),
			techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
			techRecord_vehicleClass_description: this.fb.control<string | null>(null),
			techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null),
			techRecord_vehicleType: this.fb.control<VehicleTypes | null>({ value: null, disabled: true }),
		},
		{ validators: [] }
	);

  speedLimiterExemptOptions = [
    { value: true, label: 'Exempt' },
    { value: false, label: 'Not exempt' },
  ];

  tachoExemptOptions = [
    { value: true, label: 'Exempt' },
    { value: false, label: 'Not exempt' },
  ];

  roadFriendlySuspentionOptions = [
    { value: true, label: 'Exempt' },
    { value: false, label: 'Not exempt' },
  ];

  euroStandardOptions = [
    { label: '0.10 g/kWh Euro III PM', value: '0.10 g/kWh Euro 3 PM' },
    ...getOptionsFromEnum(EmissionStandard),
  ];

  fuelPropulsionSystemOptions = [
    ...getOptionsFromEnum(FuelTypes),
  ];

  drawbarCouplingFittedOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  offRoadVehicleOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ]

	ngOnInit(): void {
		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control);
			}
		}

		this.store
			.select(techRecord)
			.pipe(take(1))
			.subscribe((techRecord) => {
				if (techRecord) this.form.patchValue(techRecord as any);
			});
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
	// get hgvControls(): Record<string, FormControl> {
	//   return {
	//     techRecord_alterationMarker: this.fb.control<boolean | null>(null),
	//     techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
	//     techRecord_drawbarCouplingFitted: this.fb.control<boolean | null>(null),
	//     techRecord_emissionsLimit: this.fb.control<number | null>(null),
	//     techRecord_euVehicleCategory: this.fb.control<string | null>(null),
	//     techRecord_euroStandard: this.fb.control<string | null>(null),
	//     techRecord_fuelPropulsionSystem: this.fb.control<FuelPropulsionSystem | null>(null),
	//     techRecord_functionCode: this.fb.control<string | null>(null),
	//     techRecord_manufactureYear: this.fb.control<number | null>(null),
	//     techRecord_noOfAxles: this.fb.control<number | null>(null),
	//     techRecord_numberOfWheelsDriven: this.fb.control<number | null>(null),
	//     techRecord_offRoad: this.fb.control<boolean | null>(null),
	//     techRecord_regnDate: this.fb.control<string | null>(null),
	//     techRecord_roadFriendly: this.fb.control<boolean | null>(null),
	//     techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
	//     techRecord_statusCode: this.fb.control<string | null>(null),
	//     techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
	//     techRecord_vehicleClass_description: this.fb.control<string | null>(null),
	//     techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null),
	//     techRecord_vehicleType: this.fb.control<VehicleTypes | null>(null)
	//   }
	// }

	isInvalid(formControlName: string) {
		const control = this.form.get(formControlName);
		return control?.invalid && control?.touched;
	}

	min(size: number, label: string): ValidatorFn {
		return (control) => {
			if (control.value && control.value < size) {
				return { min: `${label} must be greater than or equal to ${size}` };
			}

			return null;
		};
	}

	pastYear(label: string): ValidatorFn {
		return (control) => {
			if (control.value) {
				const currentYear = new Date().getFullYear();
				const inputYear = control.value;
				if (inputYear && inputYear > currentYear) {
					return { pastYear: `${label} must be the current or a past year` };
				}
			}
			return null;
		};
	}
}
