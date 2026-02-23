import { BasePage } from '../../pages/base.page';

export class TestRecordsSection extends BasePage {
	readonly createTestButton = this.page.getByRole('button', {
		name: 'Create test',
	});
}
