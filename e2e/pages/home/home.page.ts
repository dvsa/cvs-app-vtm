import { BasePage } from '../base.page';

export class HomePage extends BasePage {
	readonly searchTechRecordLink = this.page.getByRole('link', { name: 'Search for a technical record' });
	readonly createNewTechRecordLink = this.page.getByRole('link', { name: 'Create a new technical record' });
	readonly createBatchLink = this.page.getByRole('link', { name: 'Create a batch of technical records' });
	readonly refDataLink = this.page.getByRole('link', { name: 'Reference Data Administration' });
	readonly betasLink = this.page.getByRole('link', { name: 'Opt-in to betas' });
}
