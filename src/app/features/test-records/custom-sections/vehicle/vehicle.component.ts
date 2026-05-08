import { GovukFormGroupAutocompleteComponent } from '@/src/app/forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { ReferenceDataResourceType } from '@/src/app/models/reference-data.model';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { selectAllReferenceDataByResourceType, selectRefDataAutocompleteOptions } from '@/src/app/store/reference-data';
import { techRecord } from '@/src/app/store/technical-records';
import { testResultInEdit } from '@/src/app/store/test-records';
import { Component, OnDestroy, OnInit, forwardRef, inject, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BodyTypeSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { BaseTestRecordV2Component } from '@features/test-records/components/base-test-record-v2/base-test-record-v2.component';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-test-vehicle',
	templateUrl: './vehicle.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupAutocompleteComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupRadioComponent,
	],
	styleUrls: ['./vehicle.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => VehicleComponent),
			multi: true,
		},
	],
})
export class VehicleComponent extends BaseTestRecordV2Component implements OnInit, OnDestroy {
	store = inject(Store);
	optionsService = inject(MultiOptionsService);
	technicalRecordService = inject(TechnicalRecordService);

	mode = input.required<Modes>();

	techRecord = this.store.selectSignal(techRecord);
	testResult = this.store.selectSignal(testResultInEdit);
	countries = this.store.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.CountryOfRegistration));
	countryNames = this.store.select(selectRefDataAutocompleteOptions(ReferenceDataResourceType.CountryOfRegistration));

	form = this.fb.group({
		vin: this.fb.control('', []),
		trailerId: this.fb.control('', []),
		countryOfRegistration: this.fb.control<string | null>(null, [
			this.commonValidators.required('Country of Registration', 'vehicle', 'countryOfRegistration'),
		]),
		euVehicleCategory: this.fb.control<string | null>(null, [
			this.commonValidators.required('EU Vehicle Category', 'vehicle', 'euVehicleCategory'),
		]),
		odometerReading: this.fb.control<number | null>(null, [
			this.commonValidators.applyWhen(
				() => this.isOdometerReadingRequired(),
				this.commonValidators.required('Odometer Reading', 'vehicle', 'odometerReading')
			),
		]),
		odometerReadingUnits: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				() => this.isOdometerReadingUnitsRequired(),
				this.commonValidators.required('Odometer Reading Units', 'vehicle', 'odometerReadingUnits')
			),
		]),
		preparerCombination: this.fb.control<string | null>(null, []),
		preparerName: this.fb.control<string | null>(null, []),
		preparerId: this.fb.control<string | null>(null, []),
		make: this.fb.control<string | null>(null, []),
		model: this.fb.control<string | null>(null, []),
		bodyType: this.fb.control<BodyTypeSchema | null>(null),
	});

	readonly VehicleTypes = VehicleTypes;
	readonly FormNodeWidth = FormNodeWidth;
	readonly destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.init(this.form);
		this.handlePrepopulateEuVehicleCategory();

		// Load reference data
		this.optionsService.loadOptions(ReferenceDataResourceType.CountryOfRegistration);

		// Prepopulate form with current test record
		const testResult = this.testResult();
		if (testResult) {
			this.form.patchValue(testResult);
		}
	}

	ngOnDestroy() {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	handlePrepopulateEuVehicleCategory() {
		const techRecord = this.techRecord();
		const euVehicleCategory = this.form.get('euVehicleCategory');
		if (!euVehicleCategory) return;

		// Prepopulate CARs with M1
		if (techRecord?.techRecord_vehicleType === VehicleTypes.CAR) {
			euVehicleCategory.patchValue(EUVehicleCategory.M1);
			euVehicleCategory.disable();
		}

		// Prepopulate LGVs with N1
		if (techRecord?.techRecord_vehicleType === VehicleTypes.LGV) {
			euVehicleCategory.patchValue(EUVehicleCategory.N1);
			euVehicleCategory.disable();
		}
	}

	isOdometerReadingRequired(): boolean {
		const techRecord = this.techRecord();
		if (!techRecord) return false;

		// Exclude TRLs as they do not have an odometer
		if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) return false;

		// Add test specific logic here
		return true;
	}

	isOdometerReadingUnitsRequired(): boolean {
		const techRecord = this.techRecord();
		if (!techRecord) return false;

		// Exclude TRLs as they do not have an odometer
		if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) return false;

		// Add test specific logic here
		return true;
	}
}
