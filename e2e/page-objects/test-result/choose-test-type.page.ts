import { BasePage } from '../base.page';

export class ChooseTestTypePage extends BasePage {
	async select(path: readonly string[]): Promise<void> {
		for (const name of path) await this.page.getByRole('button', { name, exact: true }).click();
	}
}
