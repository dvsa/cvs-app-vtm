import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Textarea } from '../../../components/textarea.component';
import { Section, SectionValues, fillFields } from './section';

export class PurchasersSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'purchasers');
	}

	readonly fields = {
		techRecord_purchaserDetails_name: new Input(this.content, 'techRecord_purchaserDetails_name'),
		techRecord_purchaserDetails_address1: new Input(this.content, 'techRecord_purchaserDetails_address1'),
		techRecord_purchaserDetails_address2: new Input(this.content, 'techRecord_purchaserDetails_address2'),
		techRecord_purchaserDetails_postTown: new Input(this.content, 'techRecord_purchaserDetails_postTown'),
		techRecord_purchaserDetails_address3: new Input(this.content, 'techRecord_purchaserDetails_address3'),
		techRecord_purchaserDetails_postCode: new Input(this.content, 'techRecord_purchaserDetails_postCode'),
		techRecord_purchaserDetails_telephoneNumber: new Input(this.content, 'techRecord_purchaserDetails_telephoneNumber'),
		techRecord_purchaserDetails_emailAddress: new Input(this.content, 'techRecord_purchaserDetails_emailAddress'),
		techRecord_purchaserDetails_purchaserNotes: new Textarea(
			this.content,
			'techRecord_purchaserDetails_purchaserNotes'
		),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
