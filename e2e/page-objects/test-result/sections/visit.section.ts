import { Locator, Page } from '@playwright/test';
import { Autocomplete } from '../../../components/autocomplete.component';
import { Input } from '../../../components/input.component';
import { Section, SectionValues, fillFields } from '../../../components/section.component';

export class VisitSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'visit');
	}

	readonly testStationType = new Input(this.content, 'testStationType');
	readonly fields = {
		testStationPNumber: new Autocomplete(this.content, 'testStationPNumber'),
		testerStaffId: new Autocomplete(this.content, 'testerStaffId'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
