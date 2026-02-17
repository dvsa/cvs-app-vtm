import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TextareaComponent } from '@/e2e/components/textarea.component';
import { isHeavyTrailer } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class ManufacturerSection extends BasePage {
	readonly nameTextInput = new TextInputComponent(this.page, 'techRecord_manufacturerDetails_name');
	readonly address1TextInput = new TextInputComponent(this.page, 'techRecord_manufacturerDetails_address1');
	readonly address2TextInput = new TextInputComponent(this.page, 'techRecord_manufacturerDetails_address2');
	readonly townOrCityTextInput = new TextInputComponent(this.page, 'techRecord_manufacturerDetails_postTown');
	readonly countyTextInput = new TextInputComponent(this.page, 'techRecord_manufacturerDetails_address3');
	readonly postCodeTextInput = new TextInputComponent(this.page, 'techRecord_manufacturerDetails_postCode');
	readonly telephoneNumberTextInput = new TextInputComponent(
		this.page,
		'techRecord_manufacturerDetails_telephoneNumber'
	);
	readonly emailAddressTextInput = new TextInputComponent(this.page, 'techRecord_manufacturerDetails_emailAddress');
	readonly manufacturerNotesTextArea = new TextareaComponent(
		this.page,
		'techRecord_manufacturerDetails_manufacturerNotes'
	);

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (!isHeavyTrailer(data)) return;
		await this.nameTextInput.fill(data.techRecord_manufacturerDetails_name);
		await this.address1TextInput.fill(data.techRecord_manufacturerDetails_address1);
		await this.address2TextInput.fill(data.techRecord_manufacturerDetails_address2);
		await this.townOrCityTextInput.fill(data.techRecord_manufacturerDetails_postTown);
		await this.countyTextInput.fill(data.techRecord_manufacturerDetails_address3);
		await this.postCodeTextInput.fill(data.techRecord_manufacturerDetails_postCode);
		await this.telephoneNumberTextInput.fill(data.techRecord_manufacturerDetails_telephoneNumber);
		await this.emailAddressTextInput.fill(data.techRecord_manufacturerDetails_emailAddress);
		await this.manufacturerNotesTextArea.fill(data.techRecord_manufacturerDetails_manufacturerNotes);
	}
}
