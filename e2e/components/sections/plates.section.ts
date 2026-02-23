import { BasePage } from '../../pages/base.page';

export class PlatesSection extends BasePage {
	readonly generateAndSendPlateButton = this.page.getByRole('button', {
		text: 'Generate and send plate',
	});
}
