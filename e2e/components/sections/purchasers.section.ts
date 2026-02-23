import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TextareaComponent } from '@/e2e/components/textarea.component';
import { isHeavyTrailer } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class PurchasersSection extends BasePage {
	readonly nameTextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_name');
	readonly address1TextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_address1');
	readonly address2TextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_address2');
	readonly townOrCityTextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_postTown');
	readonly countyTextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_address3');
	readonly postCodeTextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_postCode');
	readonly telephoneNumberTextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_telephoneNumber');
	readonly emailAddressTextInput = new TextInputComponent(this.page, 'techRecord_purchaserDetails_emailAddress');
	readonly purchaserNotesTextArea = new TextareaComponent(this.page, 'techRecord_purchaserDetails_purchaserNotes');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (!isHeavyTrailer(data)) return;
		await this.nameTextInput.fill(data.techRecord_purchaserDetails_name);
		await this.address1TextInput.fill(data.techRecord_purchaserDetails_address1);
		await this.address2TextInput.fill(data.techRecord_purchaserDetails_address2);
		await this.townOrCityTextInput.fill(data.techRecord_purchaserDetails_postTown);
		await this.countyTextInput.fill(data.techRecord_purchaserDetails_address3);
		await this.postCodeTextInput.fill(data.techRecord_purchaserDetails_postCode);
		await this.telephoneNumberTextInput.fill(data.techRecord_purchaserDetails_telephoneNumber);
		await this.emailAddressTextInput.fill(data.techRecord_purchaserDetails_emailAddress);
		await this.purchaserNotesTextArea.fill(data.techRecord_purchaserDetails_purchaserNotes);
	}
}
