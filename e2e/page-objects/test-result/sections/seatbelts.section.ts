import { Locator, Page } from '@playwright/test';
import { DateInput } from '../../../components/date-input.component';
import { Input } from '../../../components/input.component';
import { Radios } from '../../../components/radios.component';
import { Section, SectionValues, fillFields } from '../../../components/section.component';

export class SeatbeltsSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'seatbelts');
	}

	readonly fields = {
		seatbeltInstallationCheckDate: new Radios(this.content, 'seatbeltInstallationCheckDate'),
		numberOfSeatbeltsFitted: new Input(this.content, 'numberOfSeatbeltsFitted'),
		lastSeatbeltInstallationCheckDate: new DateInput(this.content, 'lastSeatbeltInstallationCheckDate'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}
}
