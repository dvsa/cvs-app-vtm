import { BasePage } from '../../base.page';

export class SelectDefectPage extends BasePage {
	readonly searchInput = this.page.getByRole('textbox', { name: 'Search for a defect category or IM number' });
	readonly searchButton = this.page.getByRole('button', { name: 'Search', exact: true });

	deficiency(reference: string) {
		return this.page.getByRole('link', { name: reference, exact: true });
	}
}
