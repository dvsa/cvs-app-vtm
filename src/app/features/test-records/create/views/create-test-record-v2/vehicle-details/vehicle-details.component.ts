import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { FormGroupFrom } from '@/src/app/models/form.model';
import {
	ALL_EU_VEHICLE_CATEGORY_OPTIONS,
	CAR_EU_VEHICLE_CATEGORY_OPTIONS,
	HGV_EU_VEHICLE_CATEGORY_OPTIONS,
	LGV_EU_VEHICLE_CATEGORY_OPTIONS,
	MOTORCYCLE_EU_VEHICLE_CATEGORY_OPTIONS,
	PSV_EU_VEHICLE_CATEGORY_OPTIONS,
	TRL_EU_VEHICLE_CATEGORY_OPTIONS,
} from '@/src/app/models/options.model';
import { ReferenceDataResourceType } from '@/src/app/models/reference-data.model';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, computed, inject, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';

@Component({
	selector: 'app-vehicle-details',
	templateUrl: './vehicle-details.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupSelectComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupRadioComponent,
		AsyncPipe,
	],
})
export class VehicleDetailsComponent implements OnInit {
	multiOptionsService = inject(MultiOptionsService);

	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();
	techRecord = input.required<TechRecordType<'get'>>();

	formNodeWidth = FormNodeWidth;
	countryOfRegistrationOptions = this.multiOptionsService.getOptions(ReferenceDataResourceType.CountryOfRegistration);
	euVehicleCategoryOptions = computed(() => this.getEUCategoryOptions());
	odometerReadingUnitsOptions = [
		{ value: 'kilometres', label: 'Kilometres' },
		{ value: 'miles', label: 'Miles' },
	];

	ngOnInit(): void {
		this.multiOptionsService.loadOptions(ReferenceDataResourceType.CountryOfRegistration);
	}

	// @TODO: move into a shared service and use here and in general-vehicle-details
	getEUCategoryOptions() {
		const techRecord = this.techRecord();
		switch (techRecord.techRecord_vehicleType) {
			case VehicleTypes.HGV:
				return HGV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.PSV:
				return PSV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.TRL:
				return TRL_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.LGV:
				return LGV_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.CAR:
				return CAR_EU_VEHICLE_CATEGORY_OPTIONS;
			case VehicleTypes.MOTORCYCLE:
				return MOTORCYCLE_EU_VEHICLE_CATEGORY_OPTIONS;
			default:
				return ALL_EU_VEHICLE_CATEGORY_OPTIONS;
		}
	}
}
