import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { of, ReplaySubject } from 'rxjs';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import {
  GovukFormGroupInputComponent
} from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { TagType } from '@components/tag/tag.component';
import { AsyncPipe } from '@angular/common';
import {
  GovukFormGroupSelectComponent
} from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import {
  ALL_VEHICLE_CONFIGURATION_OPTIONS,
  HGV_PSV_VEHICLE_CONFIGURATION_OPTIONS,
  MultiOptions,
  TRL_VEHICLE_CONFIGURATION_OPTIONS,
} from '@models/options.model';
import { vehicleBodyTypeCodeMap } from '@models/body-type-enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';

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
  ],
})
export class GeneralVehicleDetailsComponent extends EditBaseComponent implements OnInit, OnDestroy {
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
      techRecord_vehicleConfiguration: this.fb.control<VehicleConfiguration | null>(null, [
        this.commonValidators.required('Vehicle configuration is required'),
      ]),

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

  protected readonly TagTypeLabels = TagTypeLabels;
  protected readonly FormNodeWidth = FormNodeWidth;
  protected readonly TagType = TagType;
  protected readonly VehicleTypes = VehicleTypes;
  bodyMakes$ = of<MultiOptions | undefined>([]);

}
