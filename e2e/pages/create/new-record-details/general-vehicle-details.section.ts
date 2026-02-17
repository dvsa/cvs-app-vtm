import { AutoCompleteComponent } from '@/e2e/components/autocomplete.component';
import { DateInputComponent } from '@/e2e/components/date-input.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { isHeavyTrailer } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class GeneralVehicleDetailsSection extends BasePage {
	readonly dateOfFirstRegistrationDateInput = new DateInputComponent(this.page, 'techRecord_regnDate');
	readonly monthOfManufactureSelect = new SelectComponent(this.page, 'techRecord_manufactureMonth');
	readonly yearOfManufactureTextInput = new TextInputComponent(this.page, 'techRecord_manufactureYear');
	readonly dateOfFirstUseDateInput = new DateInputComponent(this.page, 'techRecord_firstUseDate');
	readonly dtpNumberTextInput = new TextInputComponent(this.page, 'techRecord_brakes_dtpNumber');
	readonly dtpNumberAutocomplete = new AutoCompleteComponent(this.page, 'techRecord_dtpNumber');
	readonly vehicleConfigurationSelect = new SelectComponent(this.page, 'techRecord_vehicleConfiguration');
	readonly frameDescriptionSelect = new SelectComponent(this.page, 'techRecord_frameDescription');
	readonly makeSelect = new SelectComponent(this.page, 'techRecord_make');
	readonly bodyModelTextInput = new TextInputComponent(this.page, 'techRecord_bodyModel');
	readonly modelTextInput = new TextInputComponent(this.page, 'techRecord_model');
	readonly bodyTypeSelect = new SelectComponent(this.page, 'techRecord_bodyType_description');
	readonly modelLiteralTextInput = new TextInputComponent(this.page, 'techRecord_modelLiteral');
	readonly functionCodeSelect = new SelectComponent(this.page, 'techRecord_functionCode');
	readonly conversionReferenceNumberTextInput = new TextInputComponent(this.page, 'techRecord_conversionRefNo');
	readonly euVehicleCategoryRadios = new RadiosComponent(this.page, 'techRecord_euVehicleCategory');
	readonly numberOfAxlesTextInput = new TextInputComponent(this.page, 'techRecord_noOfAxles');
	readonly confirmNumberOfAxlesButton = this.page.getByRole('button', { name: 'Confirm number of axles' });
	readonly removeAndClearAllAxlesButton = this.page.getByRole('button', { name: 'Remove and clear all axles' });

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types

		if (data.techRecord_vehicleType === 'hgv') {
			await this.dateOfFirstRegistrationDateInput.fill(data.techRecord_regnDate);
			await this.yearOfManufactureTextInput.fill(data.techRecord_manufactureYear);
			await this.dtpNumberTextInput.fill(data.techRecord_brakes_dtpNumber);
			await this.vehicleConfigurationSelect.fill(data.techRecord_vehicleConfiguration);
			await this.makeSelect.fill(data.techRecord_make);
			await this.modelTextInput.fill(data.techRecord_model);
			await this.bodyTypeSelect.fill(data.techRecord_bodyType_description);
			await this.functionCodeSelect.fill(data.techRecord_functionCode);
			await this.conversionReferenceNumberTextInput.fill(data.techRecord_conversionRefNo);
			await this.euVehicleCategoryRadios.fill(data.techRecord_euVehicleCategory);
			await this.numberOfAxlesTextInput.fill(data.techRecord_noOfAxles);
			await this.confirmNumberOfAxlesButton.click();
		}

		if (isHeavyTrailer(data)) {
			await this.dateOfFirstRegistrationDateInput.fill(data.techRecord_regnDate);
			await this.monthOfManufactureSelect.fill(data.techRecord_manufactureMonth);
			await this.yearOfManufactureTextInput.fill(data.techRecord_manufactureYear);
			await this.dateOfFirstUseDateInput.fill(data.techRecord_firstUseDate);
			await this.dtpNumberTextInput.fill(data.techRecord_brakes_dtpNumber);
			await this.vehicleConfigurationSelect.fill(data.techRecord_vehicleConfiguration);
			await this.frameDescriptionSelect.fill(data.techRecord_frameDescription);
			await this.makeSelect.fill(data.techRecord_make);
			await this.modelTextInput.fill(data.techRecord_model);
			await this.bodyTypeSelect.fill(data.techRecord_bodyType_description);
			await this.functionCodeSelect.fill(data.techRecord_functionCode);
			await this.conversionReferenceNumberTextInput.fill(data.techRecord_conversionRefNo);
			await this.euVehicleCategoryRadios.fill(data.techRecord_euVehicleCategory);
			await this.numberOfAxlesTextInput.fill(data.techRecord_noOfAxles);
			await this.confirmNumberOfAxlesButton.click();
		}

		if (data.techRecord_vehicleType === 'psv') {
			await this.dateOfFirstRegistrationDateInput.fill(data.techRecord_regnDate);
			await this.yearOfManufactureTextInput.fill(data.techRecord_manufactureYear);
			await this.dtpNumberAutocomplete.fill(data.techRecord_brakes_dtpNumber);
			await this.vehicleConfigurationSelect.fill(data.techRecord_vehicleConfiguration);
			await this.bodyModelTextInput.fill(data.techRecord_bodyModel);
			await this.modelLiteralTextInput.fill(data.techRecord_modelLiteral);
			await this.functionCodeSelect.fill(data.techRecord_functionCode);
			await this.conversionReferenceNumberTextInput.fill(data.techRecord_conversionRefNo);
			await this.euVehicleCategoryRadios.fill(data.techRecord_euVehicleCategory);
			await this.numberOfAxlesTextInput.fill(data.techRecord_noOfAxles);
			await this.confirmNumberOfAxlesButton.click();
		}
	}
}
