import { GovukFormGroupAutocompleteComponent } from '@/src/app/forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { ReferenceDataResourceType } from '@/src/app/models/reference-data.model';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { TestService } from '@/src/app/services/test/test.service';
import {
	selectAllReferenceDataByResourceType,
	selectCountryOfRegistrationOptions,
} from '@/src/app/store/reference-data';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { getOptionsFromEnumWithCodeAndDescription } from '@forms/utils/enum-map';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';

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
		NumberOnlyDirective,
		RadioComponent,
	],
	styleUrls: ['./vehicle.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleComponent implements OnInit {
	store = inject(Store);
	testService = inject(TestService);
	optionsService = inject(MultiOptionsService);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);

	mode = input.required<Modes>();

	techRecord = this.store.selectSignal(techRecord);
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	countries = this.store.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.CountryOfRegistration));
	countryNames = this.store.select(selectCountryOfRegistrationOptions);

	form = this.testService.form;

	readonly VehicleTypes = VehicleTypes;
	readonly FormNodeWidth = FormNodeWidth;

	ngOnInit(): void {
		this.addValidators();
		this.handlePrepopulateEuVehicleCategory();

		// Load reference data
		this.optionsService.loadOptions(ReferenceDataResourceType.CountryOfRegistration);
	}

	addValidators(): void {
		this.form.controls.countryOfRegistration.setValidators([this.commonValidators.required('Country Of Registration')]);
		this.form.controls.euVehicleCategory.setValidators([this.commonValidators.required('EU Vehicle Category')]);
		this.form.controls.odometerReading.setValidators([
			this.commonValidators.applyWhen(
				() => this.isOdometerReadingRequired(),
				this.commonValidators.required('Odometer Reading'),
				this.commonValidators.max(9999999, 'Odometer Reading')
			),
		]);

		this.form.controls.odometerReadingUnits.setValidators([
			this.commonValidators.applyWhen(
				() => this.isOdometerReadingUnitsRequired(),
				this.commonValidators.required('Odometer Reading Units')
			),
		]);
		this.form.controls.vtg15.controls.vtg15Required.setValidators([
			this.commonValidators.applyWhen(
				() => this.isVTGRequiredMandatory(),
				this.commonValidators.required(() => {
					return {
						error: 'Select if a VTG15 is required',
						anchorLink: 'vtg15Required',
					};
				})
			),
		]);
		this.form.controls.vtg15.controls.primaryHazardClassification.setValidators([
			this.commonValidators.applyWhen(
				() => this.form.controls.vtg15.controls.vtg15Required.value ?? false,
				this.commonValidators.required('Primary hazard classification')
			),
		]);
		this.form.controls.vtg15.controls.unNumber.setValidators([
			this.commonValidators.applyWhen(
				() => this.form.controls.vtg15.controls.vtg15Required.value ?? false,
				this.commonValidators.required('UN number'),
				this.commonValidators.exactLengthDigits(4, 'UN number')
			),
		]);
	}
	isVTGRequiredMandatory(): boolean {
		const techRecord = this.techRecord();
		// not mandatory for amend mode
		if (this.mode() === Modes.AMEND) {
			return false;
		}
		if (
			techRecord?.techRecord_vehicleType === 'hgv' ||
			techRecord?.techRecord_vehicleType === 'lgv' ||
			techRecord?.techRecord_vehicleType === 'trl'
		) {
			if (techRecord?.techRecord_adrDetails_dangerousGoods === true) {
				return true;
			}
		}
		return false;
	}

	handlePrepopulateEuVehicleCategory() {
		const techRecord = this.techRecord();
		const euVehicleCategory = this.form.controls.euVehicleCategory;

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

	protected readonly Modes = Modes;
	protected readonly FORM_NODE_WIDTH = FormNodeWidth;
	protected readonly HAZARD_CLASSIFICATION_OPTIONS = getOptionsFromEnumWithCodeAndDescription(HazardClassification);
}
