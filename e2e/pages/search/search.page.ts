import { BasePage } from '../base.page';

export class SearchPage extends BasePage {
	readonly searchInput = this.page.getByRole('textbox', {
		name: 'Vehicle registration mark, trailer ID or vehicle identification number',
	});
	readonly searchCriteria = this.page.getByRole('combobox', { name: 'Search criteria' });
	readonly searchButton = this.page.getByRole('button', { name: 'Search' });
}
