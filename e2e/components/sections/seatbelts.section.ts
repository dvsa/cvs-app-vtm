import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DateInputComponent } from '../date-input.component';
import { RadiosComponent } from '../radios.component';
import { TextInputComponent } from '../text-input.component';

export class SeatbeltsSection extends BasePage {
	readonly seatbeltInstallationCheckDateRadios = new RadiosComponent(this.page, 'seatbeltInstallationCheckDate');
	readonly numberOfSeatbeltsFittedTextInput = new TextInputComponent(this.page, 'numberOfSeatbeltsFitted');
	readonly lastSeatbeltInstallationCheckDateDateInput = new DateInputComponent(
		this.page,
		'lastSeatbeltInstallationCheckDate'
	);

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		if (!(data.vehicleType === 'psv')) return;
		if (!Array.isArray(data.testTypes)) return;

		for (const testType of data.testTypes) {
			await this.seatbeltInstallationCheckDateRadios.fill(testType.seatbeltInstallationCheckDate);
			await this.numberOfSeatbeltsFittedTextInput.fill(testType.numberOfSeatbeltsFitted);
			await this.lastSeatbeltInstallationCheckDateDateInput.fill(testType.lastSeatbeltInstallationCheckDate);
		}
	}
}
