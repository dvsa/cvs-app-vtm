import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Textarea } from '../../../components/textarea.component';
import { Section, SectionValues, fillFields } from './section';

export class ManufacturerSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'manufacturer');
	}

	readonly fields = {
		techRecord_manufacturerDetails_name: new Input(this.content, 'techRecord_manufacturerDetails_name'),
		techRecord_manufacturerDetails_address1: new Input(this.content, 'techRecord_manufacturerDetails_address1'),
		techRecord_manufacturerDetails_address2: new Input(this.content, 'techRecord_manufacturerDetails_address2'),
		techRecord_manufacturerDetails_postTown: new Input(this.content, 'techRecord_manufacturerDetails_postTown'),
		techRecord_manufacturerDetails_address3: new Input(this.content, 'techRecord_manufacturerDetails_address3'),
		techRecord_manufacturerDetails_postCode: new Input(this.content, 'techRecord_manufacturerDetails_postCode'),
		techRecord_manufacturerDetails_telephoneNumber: new Input(
			this.content,
			'techRecord_manufacturerDetails_telephoneNumber'
		),
		techRecord_manufacturerDetails_emailAddress: new Input(this.content, 'techRecord_manufacturerDetails_emailAddress'),
		techRecord_manufacturerDetails_manufacturerNotes: new Textarea(
			this.content,
			'techRecord_manufacturerDetails_manufacturerNotes'
		),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
