import { BasePage } from '../../pages/base.page';

export class FiltersSection extends BasePage {
	readonly platesFilterLink = this.page.getByRole('anchor', { text: 'Plates' });
	readonly requiredFilterLink = this.page.getByRole('anchor', {
		text: 'Required',
	});
	readonly adrFilterLink = this.page.locator('anchor', { text: 'ADR' });
	readonly recordsFilterLink = this.page.locator('anchor', { text: 'Records' });
}
