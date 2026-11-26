import { GovukFormGroupAutocompleteComponent } from '@/src/app/forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@/src/app/forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@/src/app/forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { ReferenceDataResourceType } from '@/src/app/models/reference-data.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { TestService } from '@/src/app/services/test/test.service';
import {
	selectAllReferenceDataByResourceType,
	selectCountryOfRegistrationOptions,
} from '@/src/app/store/reference-data';
import { techRecord } from '@/src/app/store/technical-records';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum.js';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { getOptionsFromEnumWithCodeAndDescription } from '@forms/utils/enum-map';
import { Modes } from '@models/modes.enum';
import { MultiOptions } from '@models/options.model';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-test-vehicle',
	templateUrl: './vehicle.component.html',
	imports: [
		FormField,
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
	technicalRecordService = inject(TechnicalRecordService);

	techRecord = this.store.selectSignal(techRecord);
	countries = this.store.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.CountryOfRegistration));
	countryNames = this.store.select(selectCountryOfRegistrationOptions);

	form = this.testService.form;

	readonly FormNodeWidth = FormNodeWidth;
	readonly ODOMETER_READING_UNITS_OPTIONS: MultiOptions = [
		{ value: 'kilometres', label: 'Kilometres' },
		{ value: 'miles', label: 'Miles' },
	];

	ngOnInit(): void {
		this.prepopulateHazardClassificationOptions();
		this.handlePrepopulateEuVehicleCategory();

		// Load reference data
		this.optionsService.loadOptions(ReferenceDataResourceType.CountryOfRegistration);
	}

	// The select options are compared by reference, so stored classifications are swapped for the matching option.
	prepopulateHazardClassificationOptions(): void {
		const vtg15 = this.form.vtg15;
		for (const field of [vtg15.primaryHazardClassification, vtg15.secondaryHazardClassification]) {
			const value = field().value();
			const option = this.toHazardClassificationOption(value);
			if (option !== value) field().value.set(option);
		}
	}

	handlePrepopulateEuVehicleCategory() {
		const category = this.testService.fixedEuVehicleCategory();
		if (category !== null) this.form.euVehicleCategory().value.set(category);
	}

	toHazardClassificationOption(value?: HazardClassification | null): HazardClassification | null {
		if (!value) return null;
		return Object.values(HazardClassification).find((option) => option.code === value.code) ?? value;
	}

	protected readonly Modes = Modes;
	protected readonly FORM_NODE_WIDTH = FormNodeWidth;
	protected readonly HAZARD_CLASSIFICATION_OPTIONS = getOptionsFromEnumWithCodeAndDescription(HazardClassification);
}
