import { BasePage } from '../../pages/base.page';

export class FiltersSection extends BasePage {
	readonly platesFilterLink = this.page.getByRole('link', { name: 'Plates' });
	readonly requiredFilterLink = this.page.getByRole('link', {
		name: 'Required',
	});
	readonly adrFilterLink = this.page.getByRole('link', { name: 'ADR' });
	readonly recordsFilterLink = this.page.getByRole('link', { name: 'Records' });
}
