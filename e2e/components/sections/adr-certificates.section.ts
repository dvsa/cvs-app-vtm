import { BasePage } from '../../pages/base.page';

export class AdrCertficatesSection extends BasePage {
	readonly generateAdrCertificateButton = this.page.getByRole('button', {
		text: 'Generate ADR certificate',
	});
}
