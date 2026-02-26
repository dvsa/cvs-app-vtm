import { BasePage } from '@/e2e/pages/base.page';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { AutoCompleteComponent } from '../autocomplete.component';
import { TextInputComponent } from '../text-input.component';

export class VisitSection extends BasePage {
	readonly testStationNameAutocomplete = new AutoCompleteComponent(this.page, 'testStationName');
	readonly testStationTypeTextInput = new TextInputComponent(this.page, 'testStationType');
	readonly testerNameAutocomplete = new AutoCompleteComponent(this.page, 'testerName');

	async fill(data: Partial<TestResultSchema>): Promise<void> {
		await this.testStationNameAutocomplete.fill(data.testStationName);
		await this.testerNameAutocomplete.fill(data.testerName);
	}
}
