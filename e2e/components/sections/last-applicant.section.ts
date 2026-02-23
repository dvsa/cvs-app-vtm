import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class LastApplicantSection extends BasePage {
	readonly nameTextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_name');
	readonly addressLine1TextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_address1');
	readonly addressLine2TextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_address2');
	readonly townOrCityTextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_postTown');
	readonly countyTextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_address3');
	readonly postcodeTextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_postCode');
	readonly telephoneNumberTextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_telephoneNumber');
	readonly emailAddressTextInput = new TextInputComponent(this.page, 'techRecord_applicantDetails_emailAddress');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (data.techRecord_vehicleType !== 'psv') return;
		await this.nameTextInput.fill(data.techRecord_applicantDetails_name);
		await this.addressLine1TextInput.fill(data.techRecord_applicantDetails_address1);
		await this.addressLine2TextInput.fill(data.techRecord_applicantDetails_address2);
		await this.townOrCityTextInput.fill(data.techRecord_applicantDetails_postTown);
		await this.countyTextInput.fill(data.techRecord_applicantDetails_address3);
		await this.postcodeTextInput.fill(data.techRecord_applicantDetails_postCode);
		await this.telephoneNumberTextInput.fill(data.techRecord_applicantDetails_telephoneNumber);
		await this.emailAddressTextInput.fill(data.techRecord_applicantDetails_emailAddress);
	}
}
