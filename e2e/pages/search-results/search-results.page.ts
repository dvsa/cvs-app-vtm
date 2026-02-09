import { BasePage } from '../base.page';

export class SearchResultsPage extends BasePage {
	readonly errorSummary = this.page.getByRole('alert', { name: 'There is a problem' });
	readonly createNewTechRecordLink = this.page.getByRole('link', { name: 'Create new tech record' });
}
